const nodemailer = require("nodemailer");

exports.contactMail = async (req, res) => {
    console.log(req.body.name);
    console.log(req.body.emailId);
    console.log(req.body.message);

    let smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'ezzysplit@gmail.com',
            pass: 'bvqlzslmovlzlhrq'
        }
    })

    let mailOptions = {
        from: req.body.emailId,
        to: 'ezzysplit@gmail.com',
        subject: `Query/Suggestion from ${req.body.name}`,
        text: `From: ${req.body.emailId}
        Message:${req.body.message}`
    }

    smtpTransport.sendMail(mailOptions, (error) => {
        if (error) {
            // res.send(error)
            res.send("Failed to receive mail")
            console.log(error);
        }
        else {
            console.log("Message received");
            res.send('Message received' + res)
        }
    })
}

exports.sendmail = async (emailId, message) => {
    // let data = req.body;
    let smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'ezzysplit@gmail.com',
            pass: 'bvqlzslmovlzlhrq'
        }
    })

    let mailOptions = {
        from: 'ezzysplit@gmail.com',
        to: emailId,
        subject: `Welcome to EzzySplit family`,
        text: message
    }

    smtpTransport.sendMail(mailOptions, (error) => {
        if (error) {
            // res.send(error)
            console.log(error);
        }
        else {
            console.log("Message sent");
            // res.send('Message sent'+response)
        }
    })

    // smtpTransport.close();
}

exports.sendNotification = async(emailId, message,res)=>{
    res.status(201);
}