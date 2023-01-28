const nodemailer = require("nodemailer");

exports.sendmail = async (emailId,message) => {
    // let data = req.body;
    let smtpTransport=nodemailer.createTransport({
        service:'Gmail',
        auth:{
            user:'ezzysplit@gmail.com',
            pass:'bvqlzslmovlzlhrq'
        }
    })

    let mailOptions={
        from:'ezzysplit@gmail.com',
        to:emailId,
        subject:`Welcome to EzzySplit family`,
        text:message
    }

    smtpTransport.sendMail(mailOptions,(error)=>{
        if(error)
        {
            // res.send(error)
            console.log(error);
        }
        else{
            console.log("Message sent");
            // res.send('Message sent'+response)
        }
    })

    // smtpTransport.close();
}