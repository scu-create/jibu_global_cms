module.exports = {
  async afterCreate(event) {
    const { result } = event;

    // In Strapi v4, component data is NOT populated in event.result
    // We must re-fetch the entry with populate to get the contact component
    let contactInfo = {};
    try {
      const fullEntry = await strapi.entityService.findOne(
        'api::jgo-contact.jgo-contact',
        result.id,
        { populate: ['contact'] }
      );
      contactInfo = fullEntry?.contact || {};
    } catch (fetchErr) {
      strapi.log.error('Error fetching JGO contact entry:', fetchErr);
      return;
    }

    try {
      await strapi.plugins['email'].services.email.send({
        to: process.env.JGO_ADMIN_EMAIL_ADDRESS || process.env.ADMIN_EMAIL_ADDRESS,
        from: process.env.SMTP_USERNAME,
        subject: `New Jibu Gas One Contact Message: ${contactInfo.subject || 'No Subject'}`,
        text: `
Hello Admin,

A new contact message has been submitted from the Jibu Gas One site:

Name: ${contactInfo.name}
Email: ${contactInfo.email}
Subject: ${contactInfo.subject}

Message:
${contactInfo.message || 'No message provided'}

You can sign into the Strapi Admin Panel to view all JGO Contact records.
`,
        html: `
<h3>New Jibu Gas One Contact Message</h3>
<p><strong>Name:</strong> ${contactInfo.name}</p>
<p><strong>Email:</strong> ${contactInfo.email}</p>
<p><strong>Subject:</strong> ${contactInfo.subject}</p>
<p><strong>Message:</strong></p>
<p>${contactInfo.message ? contactInfo.message.replace(/\n/g, '<br>') : 'No message provided'}</p>
<br>
<p>Log in to your Strapi Admin Panel to view this and other entries.</p>
`,
      });
      strapi.log.info('Successfully sent JGO contact email notification.');
    } catch (err) {
      strapi.log.error('Error sending JGO contact email notification: ', err);
    }
  },
};
