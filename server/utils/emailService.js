const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendLoanApprovalEmail = async (email, loanDetails) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '✅ Loan Application Approved',
      html: `
        <h2>Congratulations!</h2>
        <p>Your loan application has been <strong>APPROVED</strong></p>
        <hr/>
        <h3>Loan Details:</h3>
        <ul>
          <li>Amount: ₹${loanDetails.amount.toLocaleString('en-IN')}</li>
          <li>Duration: ${loanDetails.duration} months</li>
          <li>Interest Rate: ${loanDetails.interestRate}% p.a.</li>
          <li>Monthly EMI: ₹${loanDetails.emi.toLocaleString('en-IN')}</li>
          <li>Total Amount: ₹${(loanDetails.emi * loanDetails.duration).toLocaleString('en-IN')}</li>
        </ul>
        <p>Thank you for choosing us!</p>
      `
    });
    console.log('✅ Email sent to', email);
  } catch (err) {
    console.error('❌ Email error:', err);
  }
};

exports.sendLoanRejectionEmail = async (email, reason) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '❌ Loan Application Status',
      html: `
        <h2>Loan Application Update</h2>
        <p>Unfortunately, your loan application has been <strong>REJECTED</strong></p>
        <p><strong>Reason:</strong> ${reason || 'Does not meet eligibility criteria'}</p>
        <p>You can reapply after 30 days. Contact support for more details.</p>
      `
    });
    console.log('✅ Email sent to', email);
  } catch (err) {
    console.error('❌ Email error:', err);
  }
};

exports.sendWelcomeEmail = async (email, name) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '👋 Welcome to MicroLoan Platform',
      html: `
        <h2>Welcome, ${name}!</h2>
        <p>Your account has been created successfully.</p>
        <p>You can now apply for loans and track your applications.</p>
        <a href="http://localhost:5173/apply" style="background:blue;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
          Apply for Loan
        </a>
      `
    });
    console.log('✅ Welcome email sent to', email);
  } catch (err) {
    console.error('❌ Email error:', err);
  }
};