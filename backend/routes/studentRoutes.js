import { Router } from "express";
const router = Router();
import PDFDocument from "pdfkit";

import auth from "../middleware/auth.js";
import Student from "../models/Student.js";
import User from "../models/User.js";

const FREE_STUDENT_LIMIT = 2;
const PLAN_DURATION_DAYS = 30;

function addDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

async function getPlanInfo(user) {
  const now = new Date();
  let plan = user?.plan || "free";
  let planStartDate = user?.planStartDate || null;
  let planEndDate = user?.planEndDate || null;

  if (plan === "pro" && planStartDate && !planEndDate) {
    planEndDate = addDays(planStartDate, PLAN_DURATION_DAYS);
    await User.findByIdAndUpdate(user._id, { planEndDate });
  }

  const hadPaidPlan = Boolean(user?.lastPaymentId || planStartDate || planEndDate);
  const isExpired = hadPaidPlan && planEndDate && planEndDate <= now;
  const isProActive = plan === "pro" && !isExpired;

  if (isExpired) {
    plan = "free";
    await User.findByIdAndUpdate(user._id, { plan: "free" });
  }

  const daysRemaining =
    isProActive && planEndDate
      ? Math.max(0, Math.ceil((planEndDate - now) / (1000 * 60 * 60 * 24)))
      : 0;

  return {
    plan,
    status: isProActive ? "active" : isExpired ? "expired" : "free",
    isProActive,
    renewalRequired: isExpired,
    startedAt: planStartDate,
    expiresAt: planEndDate,
    daysRemaining,
    freeStudentLimit: FREE_STUDENT_LIMIT,
  };
}

function validateStudentPayload(body) {
  const errors = {};
  const name = String(body.name || "").trim();
  const className = String(body.className || "").trim();
  const mobile = String(body.mobile || "").trim();
  const fees = Number(body.fees);
  const joiningDate = body.joiningDate;
  const teacherName = String(body.teacherName || "").trim();
  const startTime = String(body.batchTiming?.startTime || "").trim();
  const endTime = String(body.batchTiming?.endTime || "").trim();
  const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

  if (!name) errors.name = "Name required hai.";
  else if (name.length < 2) errors.name = "Name kam se kam 2 letters ka hona chahiye.";
  else if (!/^[a-zA-Z\s.'-]+$/.test(name)) errors.name = "Name me sirf letters use karo.";

  if (!mobile) errors.mobile = "Mobile number required hai.";
  else if (!/^[6-9]\d{9}$/.test(mobile)) errors.mobile = "Valid 10 digit Indian mobile number daalo.";

  if (!className) errors.class = "Class required hai.";
  else if (className.length > 20) errors.class = "Class value thodi short rakho.";

  if (!Number.isFinite(fees) || fees <= 0) errors.fees = "Fees 0 se zyada honi chahiye.";

  if (!joiningDate) errors.joiningDate = "Joining date required hai.";
  else if (Number.isNaN(new Date(joiningDate).getTime())) errors.joiningDate = "Valid joining date daalo.";
  else if (new Date(joiningDate) > new Date()) errors.joiningDate = "Future joining date allowed nahi hai.";

  if (!teacherName) errors.teacherName = "Teacher name required hai.";
  else if (!/^[a-zA-Z\s.'-]+$/.test(teacherName)) errors.teacherName = "Teacher name me sirf letters use karo.";

  if (!timePattern.test(startTime)) errors.startTime = "Start time select karo.";
  if (!timePattern.test(endTime)) errors.endTime = "End time select karo.";
  if (!errors.startTime && !errors.endTime && startTime >= endTime) {
    errors.endTime = "End time start time ke baad hona chahiye.";
  }

  return {
    errors,
    studentData: {
      name,
      className,
      mobile,
      fees,
      joiningDate,
      teacherName,
      batchTiming: {
        startTime,
        endTime,
      },
    },
  };
}

/* ADD STUDENT */

router.post("/add", auth, async (req, res) => {
  try {
    const { errors, studentData } = validateStudentPayload(req.body);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: "Please student details sahi se fill karo.",
        errors,
      });
    }

    const user = await User.findById(req.userId);
    const planInfo = await getPlanInfo(user);

    const totalStudents = await Student.countDocuments({
      userId: req.userId,
    });

    if (!planInfo.isProActive && totalStudents >= FREE_STUDENT_LIMIT) {
      return res.status(403).json({
        upgradeRequired: true,
        renewalRequired: planInfo.renewalRequired,
        message: planInfo.renewalRequired
          ? "Your Pro plan has expired. Please renew to add more students."
          : "Free plan limit reached",
      });
    }

    const currentMonth = new Date().toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    const newStudent = new Student({
      userId: req.userId,

      ...studentData,

      feesHistory: [
        {
          month: currentMonth,
          paid: false,
        },
      ],
    });

    await newStudent.save();

    res.json(newStudent);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.put("/update/:id", auth, async (req, res) => {
  try {
    const updatedStudent = await Student.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId,
      },

      req.body,

      { new: true },
    );

    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* GET ALL STUDENTS */

router.get("/", auth, async (req, res) => {
  try {
    const students = await Student.find({
      userId: req.userId,
    });

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* PENDING FEES STUDENTS */

router.get("/pending", auth, async (req, res) => {
  try {
    const students = await Student.find({
      userId: req.userId,
    });

    const currentMonth = new Date().toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    const pendingStudents = students.filter((student) => {
      const monthRecord = student.feesHistory.find(
        (f) => f.month === currentMonth,
      );

      return !monthRecord || monthRecord.paid === false;
    });

    res.json(pendingStudents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/dashboard", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const planInfo = await getPlanInfo(user);

    const students = await Student.find({
      userId: req.userId,
    });

    const totalStudents = students.length;

    const today = new Date();

    const currentMonth = today.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    let totalFees = 0;
    let pendingFees = 0;

    const teacherEarnings = {};

    students.forEach((student) => {
      totalFees += student.fees;

      const monthData = student.feesHistory.find(
        (f) => f.month === currentMonth,
      );

      if (!monthData || !monthData.paid) {
        pendingFees += student.fees;
      } else {
        const teacher = student.teacherName || "Unknown";

        if (!teacherEarnings[teacher]) {
          teacherEarnings[teacher] = 0;
        }

        teacherEarnings[teacher] += student.fees;
      }
    });

    // Class wise students
    const classWise = {};

    students.forEach((student) => {
      const cls = student.className;

      if (!classWise[cls]) {
        classWise[cls] = 0;
      }

      classWise[cls] += 1;
    });

    res.json({
      totalStudents,
      totalFees,
      pendingFees,
      classWiseStudents: classWise,
      teacherEarnings,
      planInfo,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/details/:id", auth, async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,

      userId: req.userId,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/collect-fees/:id", auth, async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,

      userId: req.userId,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const currentMonth = new Date().toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    let feeRecord = student.feesHistory.find((f) => f.month === currentMonth);

    if (!feeRecord) {
      student.feesHistory.push({
        month: currentMonth,
        paid: true,
        paidDate: new Date(),
      });
    } else {
      feeRecord.paid = true;
      feeRecord.paidDate = new Date();
    }

    await student.save();

    res.json({ message: "Fees collected successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/delete/:id", auth, async (req, res) => {
  try {
    await Student.findOneAndDelete({
      _id: req.params.id,

      userId: req.userId,
    });

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/download-pdf", async (req, res) => {
  try {
    // ── Auth via query param (window.open can't send headers) ──────────────
    const token = req.query.token;
    if (!token) return res.status(401).json({ message: "No token provided" });

    let userId;
    try {
      const jwt = (await import("jsonwebtoken")).default;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const students = await Student.find({ userId });

    const today = new Date();
    const currentMonth = today.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    const totalStudents = students.length;
    let totalFees     = 0;
    let collectedFees = 0;
    let pendingFees   = 0;

    students.forEach((s) => {
      totalFees += s.fees;
      const rec = s.feesHistory.find((f) => f.month === currentMonth);
      if (rec && rec.paid) collectedFees += s.fees;
      else pendingFees += s.fees;
    });

    const doc = new PDFDocument({
      size: "A4",
      margin: 0,
      info: {
        Title: `Student Report – ${currentMonth}`,
        Author: "Scholars",
      },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="student-report-${Date.now()}.pdf"`
    );
    doc.pipe(res);

    const W        = 595.28;
    const MARGIN   = 40;
    const COL_W    = W - MARGIN * 2;
    const BLACK    = "#0f0f0f";
    const GRAY     = "#6b7280";
    const LIGHT    = "#f3f4f6";
    const BORDER   = "#e5e7eb";
    const GREEN    = "#059669";
    const GREEN_BG = "#ecfdf5";
    const RED      = "#dc2626";
    const RED_BG   = "#fef2f2";
    const ACCENT   = "#6c63ff";

    function roundedRect(x, y, w, h, r, fillColor, strokeColor) {
      doc.save();
      doc.roundedRect(x, y, w, h, r);
      if (fillColor) doc.fill(fillColor);
      if (strokeColor && !fillColor) {
        doc.strokeColor(strokeColor).stroke();
      } else if (strokeColor) {
        doc.roundedRect(x, y, w, h, r).strokeColor(strokeColor).lineWidth(0.5).stroke();
      }
      doc.restore();
    }

    // ── HEADER ─────────────────────────────────────────────────────────────
    doc.rect(0, 0, W, 110).fill(BLACK);
    doc.circle(MARGIN + 6, 52, 5).fill(ACCENT);

    doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(22)
      .text("Scholars", MARGIN + 18, 38, { continued: false });

    doc.fillColor("#9ca3af").font("Helvetica").fontSize(10)
      .text("Student Report", MARGIN + 18, 64);

    const dateStr = today.toLocaleDateString("en-IN", {
      day: "2-digit", month: "long", year: "numeric",
    });
    doc.fillColor("#9ca3af").font("Helvetica").fontSize(9)
      .text(dateStr, MARGIN, 38, { width: COL_W, align: "right" });

    doc.fillColor("#6b7280").fontSize(9)
      .text(currentMonth.toUpperCase(), MARGIN, 64, { width: COL_W, align: "right" });

    // ── SUMMARY CARDS ──────────────────────────────────────────────────────
    let y = 130;
    const CARD_W = (COL_W - 16) / 3;
    const CARD_H = 72;

    const cards = [
      { label: "TOTAL STUDENTS", value: String(totalStudents),                          color: ACCENT, bg: "#f5f4ff"  },
      { label: "FEES COLLECTED", value: `Rs.${collectedFees.toLocaleString("en-IN")}`,  color: GREEN,  bg: GREEN_BG  },
      { label: "FEES PENDING",   value: `Rs.${pendingFees.toLocaleString("en-IN")}`,    color: pendingFees > 0 ? RED : GREEN, bg: pendingFees > 0 ? RED_BG : GREEN_BG },
    ];

    cards.forEach((card, i) => {
      const cx = MARGIN + i * (CARD_W + 8);
      roundedRect(cx, y, CARD_W, CARD_H, 8, card.bg, BORDER);
      doc.save().roundedRect(cx, y, 3, CARD_H, 2).fill(card.color).restore();
      doc.fillColor(GRAY).font("Helvetica").fontSize(7.5)
        .text(card.label, cx + 12, y + 14, { width: CARD_W - 16 });
      doc.fillColor(BLACK).font("Helvetica-Bold")
        .fontSize(card.value.length > 8 ? 15 : 18)
        .text(card.value, cx + 12, y + 30, { width: CARD_W - 16 });
    });

    y += CARD_H + 28;

    // ── STUDENT TABLE ──────────────────────────────────────────────────────
    doc.fillColor(GRAY).font("Helvetica").fontSize(8).text("ALL STUDENTS", MARGIN, y);
    y += 16;

    const cols = {
      name:    { x: MARGIN,       w: 130, label: "Name"    },
      class:   { x: MARGIN + 130, w: 60,  label: "Class"   },
      teacher: { x: MARGIN + 190, w: 110, label: "Teacher" },
      fees:    { x: MARGIN + 300, w: 70,  label: "Fees"    },
      status:  { x: MARGIN + 370, w: 145, label: "Status"  },
    };

    doc.rect(MARGIN, y, COL_W, 26).fill(LIGHT);
    doc.rect(MARGIN, y, COL_W, 26).strokeColor(BORDER).lineWidth(0.5).stroke();

    Object.values(cols).forEach(({ x, w, label }) => {
      doc.fillColor(GRAY).font("Helvetica-Bold").fontSize(8)
        .text(label.toUpperCase(), x + 6, y + 9, { width: w - 8 });
    });

    y += 26;

    students.forEach((student, idx) => {
      const ROW_H = 28;
      if (y + ROW_H > 820) { doc.addPage(); y = 40; }

      if (idx % 2 === 0) doc.rect(MARGIN, y, COL_W, ROW_H).fill("#fafafa");
      doc.rect(MARGIN, y, COL_W, ROW_H).strokeColor(BORDER).lineWidth(0.5).stroke();

      const rec  = student.feesHistory.find((f) => f.month === currentMonth);
      const paid = rec && rec.paid;

      doc.fillColor(BLACK).font("Helvetica-Bold").fontSize(9)
        .text(student.name || "-", cols.name.x + 6, y + 9, { width: cols.name.w - 8, ellipsis: true });

      doc.fillColor(GRAY).font("Helvetica").fontSize(9)
        .text(student.className || "-", cols.class.x + 6, y + 9, { width: cols.class.w - 8 });

      doc.fillColor(GRAY).font("Helvetica").fontSize(9)
        .text(student.teacherName || "-", cols.teacher.x + 6, y + 9, { width: cols.teacher.w - 8, ellipsis: true });

      doc.fillColor(BLACK).font("Helvetica-Bold").fontSize(9)
        .text(`Rs.${(student.fees || 0).toLocaleString("en-IN")}`, cols.fees.x + 6, y + 9, { width: cols.fees.w - 8 });

      const badgeColor = paid ? GREEN   : RED;
      const badgeBg    = paid ? GREEN_BG : RED_BG;
      const badgeText  = paid ? "PAID"  : "PENDING";
      const badgeW     = 52;
      const badgeX     = cols.status.x + 6;
      const badgeY     = y + 7;

      roundedRect(badgeX, badgeY, badgeW, 14, 4, badgeBg);
      doc.fillColor(badgeColor).font("Helvetica-Bold").fontSize(7.5)
        .text(badgeText, badgeX, badgeY + 3, { width: badgeW, align: "center" });

      if (paid && rec.paidDate) {
        const paidOn = new Date(rec.paidDate).toLocaleDateString("en-IN", {
          day: "2-digit", month: "short",
        });
        doc.fillColor(GRAY).font("Helvetica").fontSize(7.5)
          .text(paidOn, badgeX + badgeW + 4, badgeY + 3, { width: cols.status.w - badgeW - 14 });
      }

      y += ROW_H;
    });

    if (students.length === 0) {
      doc.fillColor(GRAY).font("Helvetica").fontSize(11)
        .text("No students found.", MARGIN, y + 16, { width: COL_W, align: "center" });
      y += 50;
    }

    y += 28;

    // ── CLASS-WISE BREAKDOWN ───────────────────────────────────────────────
    const classWise = {};
    students.forEach((s) => {
      const c = s.className || "Unknown";
      classWise[c] = (classWise[c] || 0) + 1;
    });
    const classEntries = Object.entries(classWise);

    if (classEntries.length > 0) {
      if (y + 100 > 820) { doc.addPage(); y = 40; }

      doc.fillColor(GRAY).font("Helvetica").fontSize(8)
        .text("CLASS-WISE BREAKDOWN", MARGIN, y);
      y += 16;

      const BAR_MAX_W = COL_W - 120;
      const maxCount  = Math.max(...classEntries.map(([, c]) => c));

      classEntries.forEach(([cls, count]) => {
        if (y + 22 > 820) { doc.addPage(); y = 40; }

        doc.fillColor(BLACK).font("Helvetica").fontSize(9)
          .text(`Class ${cls}`, MARGIN, y + 4, { width: 80 });

        const barW = Math.max(4, (count / maxCount) * BAR_MAX_W);
        doc.rect(MARGIN + 85, y + 6, barW, 10).fill(ACCENT + "33");
        doc.rect(MARGIN + 85, y + 6, barW, 10).strokeColor(ACCENT).lineWidth(0.5).stroke();

        doc.fillColor(ACCENT).font("Helvetica-Bold").fontSize(9)
          .text(String(count), MARGIN + 85 + barW + 6, y + 4);

        y += 22;
      });

      y += 16;
    }

    // ── FOOTER ─────────────────────────────────────────────────────────────
    const PAGE_H = 841.89;
    doc.rect(0, PAGE_H - 36, W, 36).fill(LIGHT);
    doc.fillColor(GRAY).font("Helvetica").fontSize(8)
      .text(
        `Generated by Scholars  ·  ${today.toLocaleString("en-IN")}  ·  ${totalStudents} student${totalStudents !== 1 ? "s" : ""}`,
        MARGIN, PAGE_H - 22,
        { width: COL_W, align: "center" }
      );

    doc.end();
  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
