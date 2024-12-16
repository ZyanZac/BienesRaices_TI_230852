import nodemailer from 'nodemailer'

const emailRegistro = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const { email, nombre, token } = datos

  //Enviar el email
  await transport.sendMail({
    from: 'BienesRaices.com',
    to: email,
    subject: 'Confirma tu cuenta en BienesRaices.com',
    text: 'Confirma tu cuenta en BienesRaices.com',
    html: `Hola ${nombre},

  Gracias por registrarte en Bienes Raíces. Para activar tu cuenta, por favor haz clic en el siguiente enlace:
  ${process.env.BACKEND_URL}:${process.env.PORT ?? 3001}/auth/confirmar/${token}

  Si no has creado esta cuenta, puedes ignorar este mensaje.

  Atentamente,
  El equipo de Bienes Raíces`,
      html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 20px; background-color: #f6f6f6; font-family: Arial, sans-serif;">
          <table cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <tr>
                  <td style="padding: 40px;">
                      <img src="https://blog.cliengo.com/wp-content/uploads/2023/01/BLOG_Imagenes-destacadas-https___blog.cliengo.com_que-es-bienes-raices_.png" 
                          alt="Bienes Raíces Banner" 
                          style="width: 100%; height: auto; border-radius: 4px;">
                      
                      <h1 style="color: #573280; font-size: 24px; margin: 30px 0 10px;">
                          ¡Bienvenido(a), ${nombre}!
                      </h1>
                      
                      <h2 style="color: #9D8DF1; font-size: 20px; margin: 0 0 30px;">
                          Confirma tu cuenta en Bienes Raíces
                      </h2>
                      
                      <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                          Nos complace darte la bienvenida a la plataforma líder en bienes raíces, donde podrás descubrir, comprar y ofertar propiedades de manera segura y eficiente.
                      </p>
                      
                      <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                          Para comenzar a explorar todas nuestras funcionalidades, por favor confirma tu cuenta haciendo clic en el siguiente botón:
                      </p>
                      
                      <div style="text-align: center; margin: 40px 0;">
                          <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3001}/auth/confirmar/${token}"
                            style="display: inline-block; padding: 15px 30px; background-color: #573280; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                            Confirmar mi cuenta
                          </a>
                      </div>
                      
                      <p style="color: #999999; font-size: 14px; margin-bottom: 30px;">
                          Si no has creado esta cuenta, puedes ignorar este mensaje de forma segura.
                      </p>
                      
                      <div style="border-top: 1px solid #eeeeee; padding-top: 20px; margin-top: 40px;">
                          <table style="width: 100%;">
                              <tr>
                                  <td style="vertical-align: middle;">
                                      <img src="https://img.freepik.com/fotos-premium/logotipo-bienes-raices-casa-fondo-blanco-ilustracion-vectorial_1015980-641956.jpg" 
                                          alt="Logo Bienes Raíces" 
                                          style="width: 50px; height: auto;">
                                  </td>
                                  <td style="vertical-align: middle; padding-left: 15px;">
                                      <p style="color: #9D8DF1; font-weight: bold; margin: 0;">
                                          Equipo de Bienes Raíces
                                      </p>
                                  </td>
                              </tr>
                          </table>
                      </div>
                  </td>
              </tr>
          </table>
      </body>
      </html>`
  });
}

const emailOlvidePassword = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const { email, nombre, token } = datos

  //Enviar el email
  await transport.sendMail({
    from: 'BienesRaices.com',
    to: email,
    subject: 'Restablece tu password en BienesRaices.com',
    text: 'Restablece tu password en BienesRaices.com',
    html: `Hola ${nombre},

  Has solicitado restablecer la contraseña de tu cuenta en Bienes Raíces. Para crear una nueva contraseña, por favor haz clic en el siguiente enlace:
  ${process.env.BACKEND_URL}:${process.env.PORT ?? 3001}/auth/olvide-password/${token}

  Este enlace expirará en 24 horas por motivos de seguridad.

  Si no solicitaste restablecer tu contraseña, puedes ignorar este mensaje. Tu cuenta está segura.

  Atentamente,
  El equipo de Bienes Raíces`,
      html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 20px; background-color: #f6f6f6; font-family: Arial, sans-serif;">
          <table cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <tr>
                  <td style="padding: 40px;">
                      <table style="width: 100%;">
                          <tr>
                              <td style="text-align: center; padding-bottom: 30px;">
                                  <img src="https://img.freepik.com/fotos-premium/logotipo-bienes-raices-casa-fondo-blanco-ilustracion-vectorial_1015980-641956.jpg" 
                                      alt="Logo Bienes Raíces" 
                                      style="width: 80px; height: auto;">
                              </td>
                          </tr>
                      </table>

                      <h1 style="color: #573280; font-size: 24px; margin: 0 0 20px;">
                          Hola, ${nombre}
                      </h1>
                      
                      <h2 style="color: #9D8DF1; font-size: 20px; margin: 0 0 30px;">
                          Recuperación de contraseña
                      </h2>
                      
                      <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                          Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en Bienes Raíces. Si tú no realizaste esta solicitud, puedes ignorar este mensaje.
                      </p>
                      
                      <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                          Para crear una nueva contraseña, haz clic en el siguiente botón:
                      </p>
                      
                      <div style="text-align: center; margin: 40px 0;">
                          <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3001}/auth/olvide-password/${token}"
                            style="display: inline-block; padding: 15px 30px; background-color: #573280; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                            Restablecer contraseña
                          </a>
                      </div>
                      
                      <div style="background-color: #f8f8f8; border-radius: 5px; padding: 20px; margin: 30px 0;">
                          <p style="color: #666666; font-size: 14px; margin: 0;">
                              <strong style="color: #573280;">Nota de seguridad:</strong><br>
                              • Este enlace expirará en 24 horas por tu seguridad.<br>
                              • Si no solicitaste este cambio, te recomendamos revisar la seguridad de tu cuenta.<br>
                              • Nunca compartiremos tu contraseña ni te pediremos que la reveles.
                          </p>
                      </div>
                      
                      <div style="border-top: 1px solid #eeeeee; padding-top: 20px; margin-top: 40px;">
                          <p style="color: #999999; font-size: 14px; margin: 0 0 20px; text-align: center;">
                              ¿Necesitas ayuda? Contáctanos a través de nuestro centro de soporte.
                          </p>
                          
                          <table style="width: 100%;">
                              <tr>
                                  <td style="text-align: center;">
                                      <p style="color: #9D8DF1; font-weight: bold; margin: 0;">
                                          Equipo de Bienes Raíces
                                      </p>
                                  </td>
                              </tr>
                          </table>
                      </div>
                  </td>
              </tr>
          </table>
      </body>
      </html>`
  });

}

export { emailRegistro, emailOlvidePassword }