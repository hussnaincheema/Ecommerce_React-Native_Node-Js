import nodemailer from "nodemailer";

const sendEmail = async (options: { email: string; subject: string; message: string }) => {
    // Development Fallback: If credentials are placeholders, log to console instead of failing
    if (process.env.SMTP_EMAIL === "your-email@gmail.com" || !process.env.SMTP_PASSWORD || process.env.SMTP_PASSWORD === "your-app-password") {
        console.warn("⚠️ SMTP Credentials are not configured. Email will be logged to console below:");
        console.log("----------------------- EMAIL SIMULATION -----------------------");
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: ${options.message}`);
        console.log("----------------------------------------------------------------");
        return;
    }

    const transporterConfigs: any = {
        service: 'gmail',
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    };

    // If not gmail, use host/port
    if (process.env.SMTP_HOST && !process.env.SMTP_HOST.includes("gmail")) {
        delete transporterConfigs.service;
        transporterConfigs.host = process.env.SMTP_HOST;
        transporterConfigs.port = Number(process.env.SMTP_PORT) || 587;
        transporterConfigs.secure = transporterConfigs.port === 465;
    }

    const transporter = nodemailer.createTransport(transporterConfigs);

    const message = {
        from: `${process.env.FROM_NAME || "Ecommerce App"} <${process.env.SMTP_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    console.log(`📧 Attempting to send email to: ${options.email}`);
    try {
        await transporter.sendMail(message);
        console.log("✅ Email sent successfully");
    } catch (error) {
        console.error("❌ nodemailer Error:", error);
        throw error;
    }
};

export default sendEmail;
