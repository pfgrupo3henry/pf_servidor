const { newUser, getAllUsers, loginUser, logout, getUserReviews, newUserAuth0, promoteUser, blockUser, unblockUser, changeAdminRole } = require('../controllers/users.controllers');
const { User } = require('../db');
const cloudinary = require('cloudinary').v2;
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const {JWT_SECRET} = process.env;
const jwt = require ("jsonwebtoken");

// Configuration 
cloudinary.config({
  cloud_name: "dapq4icmj",
  api_key: "182849148671358",
  api_secret: "LiNdU8c3mGXxCnRed_xiA9xQtLk"
});

const createUser = async (req, res) => {
    const { firstname, lastname, email, mobile, password, role, nationality, status, img } = req.body;
    try {
        const user = await newUser(firstname, lastname, email, mobile, password, role, nationality, status, img);
        res.status(201).send({userId: user});

    } catch (error) {
        res.status(400).json({ message: 'Error in user creation', error: error.message});
      }
};  

const getUserByEmail = async (req, res) => {
    
    const { email } = req.params;
    try {
        const user = await User.findOne({where: {email: email}});
        if(!user) {res.status(400).json({ message: 'The mail of the user doest exist'})}
        else {res.status(201).send(user)}

    } catch (error) {
        res.status(400).json({ message: 'Error to locate User', error: error});
      }
};  

const userAuth0Create= async (req, res) => {
    const { email, img, firstname }= req.body;
    try{
        const user= await newUserAuth0(email, img, firstname);
        res.status(201).send( { userId: user.id });
    } catch (error) {
        res.status(400).json({ message: 'Error in user creation', error: error.message })
    }
};

const modifyUser= async (req, res) => {

    try {
        let { email }= req.params;
        let { firstname, lastname, nationality, mobile, img }= req.body;
console.log(img)
        const user= await User.findOne({
            where: {
                email: email
            }
        });
        
        if(!user){
            return res.status(404).json( { message: 'Error in user creation' })
        };
    
        if(img.length > 0){
            // Generate The output url    
            const res = await cloudinary.uploader.upload(`${img[0]}`, {folder: "img_profile", public_id: `profile-${email}`})

            img[0] = res.url
        }

        let updatedUser= await user.update({
            firstname: firstname,
            lastname: lastname,
            nationality: nationality,
            mobile: mobile,
            img: img
        });

        res.status(201).json(updatedUser);
    } catch (error) {
        res.status(401).json({ message: error });
    }
}; 

const resetPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    const mailGenerator = new Mailgen({
        theme: 'cerberus',
        product: {
            // Appears in header & footer of e-mails
            name: 'HenryGameStore',
            link: 'https://pf-front-y72g-git-develop-pfgrupo3henry.vercel.app/home'
            // Optional product logo
            // logo: 'https://mailgen.js/img/logo.png'
        }
    });

    if (!email) {
        return res.status(400).json({ message: 'El email ingresado no está registrado' });
      }

    try {
        const token = jwt.sign(
            { userId: user.id, email },
            JWT_SECRET,
            { expiresIn: '1h' }
          );

         await user.update({
            refreshToken : token,
            tokenExpirationDate: new Date().getTime() + 3600000, // 1 hora en milisegundos
          });

          const resetLink = `https://pfservidor-production.up.railway.app/password-reset/${token}`;


    //send email
    const emailBody = {
        body: {
          name: user.name,
          intro: 'Has solicitado restablecer tu contraseña en Henry Game Store. Haz clic en el botón de abajo para continuar:',
          action: {
            instructions: 'Para restablecer tu contraseña, haz clic en el botón de abajo:',
            button: {
              color: '#22BC66', // Color del botón
              text: 'Restablecer tu contraseña', // Texto del botón
              link: resetLink, // Enlace para restablecer la contraseña
            },
          },
          outro: 'Si no has solicitado restablecer tu contraseña, puedes ignorar este correo electrónico y tu contraseña seguirá siendo la misma.',
        },
      };

      const emailHtml = mailGenerator.generate(emailBody);

      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: `${GMAIL_USER}`, // generated ethereal user
            pass: `${GMAIL_PASS}`, // generated ethereal password
        },
      });

      const mailOptions = {
        from: `${GMAIL_USER}`, // Tu dirección de correo electrónico
        to: user.email, // Correo electrónico del destinatario
        subject: 'Restablecer contraseña de en Henry Game Store', // Asunto del correo electrónico
        html: emailHtml, // Plantilla de correo electrónico generada por mailgen
      };

      await transporter.sendMail(mailOptions);
       res.status(200).json("Mail enviado correctamente")
        } catch (error){
            res.status(400).json({ message: error.message });
        }
}

const createNewPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
  
    try {
      // Verificar el token de restablecimiento y extraer la información necesaria
      const decodedToken = jwt.verify(token, JWT_SECRET);
      const { userId, email } = decodedToken;
  
      // Buscar el usuario en la base de datos
      const user = await User.findOne({ where: { id: userId, email } });
  
      // Si el usuario no existe o el token ha expirado, enviar un mensaje de error
      if (!user || user.resetTokenExpirationDate < new Date().getTime()) {
        return res.status(400).json({ message: 'El enlace de restablecimiento de contraseña es inválido o ha expirado' });
      }
      const newtoken = generateRefreshToken(userId)
      // Actualizar la contraseña del usuario
      await user.update({
        password,
        refreshToken: newtoken,
      });
        res.status(200).json(user);
      } catch (error) {
        return res.status(400).json({message: error});
      }
}

const allUsers= async(req, res)=>{
    try {
        const allUsers= await getAllUsers();
        res.status(200).send(allUsers);

    } catch(error) {
        res.status(400).json({ message: 'Can not get all users', error: error.message});
    }
}

const loginhandler= async(req, res)=> {
    const { email, password } = req.body;

    try{
        const loginData= await loginUser(email, password);
         res.cookie('refreshToken', loginData.token, {
                httpOnly: true,
                maxAge: 72*60*60*1000,
            });
       
         res.status(201).send(loginData);
    } catch (error) {
        res.status(400).json({ message: 'Error in user login', error: error.message});
    }
}

const logoutHandler= async (req, res) => {

    const cookie= req.cookies;
    try{
        if (!cookie.refreshToken) throw new Error('No RefreshToken in Cookies');
        const refreshToken= cookie.refreshToken;
        const userLogOut= await logout(refreshToken);
        
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
        });
        res.status(200).send({userId:userLogOut}); 
    } catch (error) {
        res.status(400).json({ message: 'Error in user logout', error: error.message})
    }
}
        

const getUserReviewsHandler= async (req, res) => {
    const { id } = req.params;
    // if (Number(req.user.id) !== Number(id)) throw new Error("You cant access to that information");  //ver si es necesario, lo que controlo es que un user logueado no acceda a los reviews de otro user 
    try {
        const reviews= await getUserReviews(id);
        res.status(200).json(reviews);
    } catch (error) {
        res.status(400).json({ message: 'Error getting Users Reviews', error: error.message })
    }
};


const promoteOrBlockUser= async (req, res)=> {
    const { id } = req.params;
    const { promote, block } = req.body;
   
    try {
        if (promote === undefined && block === undefined) throw new Error ('You must send if you want to promote or block/unblock the user');
        switch (promote) {
            case true:
                const userPromoted= await promoteUser(id);
                res.status(200).json({ message: "User has been promoted to administrator successfully", user: userPromoted });
                break;
            case false: 
                const changeAdmin= await changeAdminRole(id);
                res.status(200).json({ message: "User has been changed to user role successfully", user: changeAdmin });
                break;
                
            default: { break }
        };
        if (block) {
            const userBlocked= await blockUser(id);
            res.status(200).json({ message: "User has been blocked successfully", user: userBlocked });
        } else if (block===false) {
            const unblockedUser= await unblockUser(id);
            res.status(200).json({ message: "User has been unblocked successfully", user: unblockedUser });
        }
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}



module.exports = { createUser, allUsers, loginhandler, logoutHandler, getUserByEmail, getUserReviewsHandler, userAuth0Create, modifyUser, promoteOrBlockUser, resetPassword, createNewPassword };