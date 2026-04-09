module.exports = {
    async afterCreate(event) {
        const { result } = event;

        try {
      await strapi.plugins['email'].services.email.send({
        to: process.env.JGO_ADMIN_EMAIL_ADDRESS || process.env.ADMIN_EMAIL_ADDRESS,
        from: process.env.SMTP_USERNAME,
        subject: `New JIBU GAS ONE Franchise Application from ${result.Name}`,
        text: `
Hello Admin,

A new Jibu Gas One Franchise/AMF application has been submitted:

Name: ${result.Name}
Email: ${result.Email}
Phone: ${result.Phone}
Country: ${result.Country}
Location: ${result.SetupLocation}
Type: ${result.AMF}
LinkedIn: ${result.LinkedIn}

You can view the full details and their uploaded resume in the Strapi Admin Panel.
        `,
                html: `
<h3>New Franchise Application</h3>
<p><strong>Name:</strong> ${result.Name}</p>
<p><strong>Email:</strong> ${result.Email}</p>
<p><strong>Phone:</strong> ${result.Phone}</p>
<p><strong>Country:</strong> ${result.Country}</p>
<p><strong>Setup Location:</strong> ${result.SetupLocation}</p>
<p><strong>Franchise Type:</strong> ${result.AMF}</p>
<p><strong>LinkedIn:</strong> <a href="${result.LinkedIn}">${result.LinkedIn}</a></p>
<br>
<p>Log in to your Strapi Admin Panel to view the full application and attached resume.</p>
        `,
            });
            strapi.log.info('Successfully sent franchise application email notification.');
        } catch (err) {
            strapi.log.error('Error sending franchise application email notification: ', err);
        }
    },
};
