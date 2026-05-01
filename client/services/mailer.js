import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID  = 'service_w8h7ijm';
const EMAILJS_PUBLIC_KEY  = 'isxKmyCln_xRHpmMW'; 

const TEMPLATE_LOGIN = 'template_e3oy08v';
const TEMPLATE_APPOINTMENT = 'template_7kfr768';

emailjs.init(EMAILJS_PUBLIC_KEY);

const mailer = {

  // ✅ LOGIN EMAIL
  async sendLoginNotification(userEmail, userName) {
    console.log('[MAILER] Initiating Login Notification...');
    try {
      const now = new Date();

      const templateParams = {
        to_email: userEmail,
        name: 'Campus Dispensary',
        user_name: userName,
        login_date: now.toLocaleDateString(),
        login_time: now.toLocaleTimeString(),
        device_info: navigator.userAgent
      };
      
      console.log('[MAILER] Sending to EmailJS...', templateParams);
      const res = await emailjs.send(
        EMAILJS_SERVICE_ID,
        TEMPLATE_LOGIN,
        templateParams,
        { publicKey: EMAILJS_PUBLIC_KEY }
      );

      console.log('[MAILER] Login email sent:', res.status);
    } catch (err) {
      console.error('[MAILER ERROR] Failed login email:', err);
      alert('EmailJS Failed! Message: ' + err.text);
    }
  },

  // ✅ APPOINTMENT CONFIRMATION
  async sendAppointmentConfirmation(patientEmail, patientName, date, time, doctorName) {
    console.log('[MAILER] Initiating Appointment Confirmation...');
    try {
      const templateParams = {
        to_email: patientEmail,
        name: 'Campus Dispensary',
        user_name: patientName,
        appointment_id: Math.floor(Math.random() * 100000),
        doctor_name: doctorName,
        appointment_date: date,
        appointment_time: time
      };

      console.log('[MAILER] Sending to EmailJS...', templateParams);
      const res = await emailjs.send(
        EMAILJS_SERVICE_ID,
        TEMPLATE_APPOINTMENT,
        templateParams,
        { publicKey: EMAILJS_PUBLIC_KEY }
      );

      console.log('[MAILER] Appointment email sent:', res.status);
    } catch (err) {
      console.error('[MAILER ERROR] Failed appointment email:', err);
      alert('EmailJS Failed! Message: ' + err.text);
    }
  }
};

window.mailer = mailer;
export default mailer;