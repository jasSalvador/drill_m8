import jwt from "jsonwebtoken";
import Usuario from "../models/user.model.js";


//se emite token
export const emitToken = async (req, res, next) => {
    let { email, password } = req.body; //rescatamos email y password del form login
    let usuario = await Usuario.findOne({ //guarda en usuario, el usuario q devuelve
        where: { email, password }, //consulta, dnd coincida email y pasword
        attributes: ["id", "firstName", "lastName", "email", "status"], //devuelve esto
    });
    //verificamos usuario
    if (!usuario) { //si no encuentra o los datos no existen
        return res
            .status(400)
            .json({ code: 400, message: "Error de autenticación." });
    }
    //generamos el token si el usuario existe
    let token = jwt.sign(
        {
            exp: Math.floor(Date.now() / 1000) + 120 * 60, //asignamos el tiempo q dura el token (min, seg)
            data: usuario,
        },
        process.env.PASSWORD_SECRET
    );
    req.token = token; //se guarda el token en: req.token
    console.log("token emitido");
    next();
};

//verificacion token
export const verifyToken = (req, res, next) => {
    try {
        let { token } = req.query; //pasamos token x url
        console.log(token);

        //si no se encuentrara el token, se busca en req.headers
        if (!token) { 
            token = req.headers["authorization"];
            if (!token)
                return res
                    .status(400)
                    .send(
                        "ruta protegida, debe proporcionar un token de acceso."
                    );
            token = token.split(" ")[1];
            console.log(token);
            if (token.length == 0) {
                throw new Error("No se ha proporcionado un token");
            }
        }

        //descodificamos token usando clave secreta
        jwt.verify(
            token,
            process.env.PASSWORD_SECRET,
            async (error, decoded) => {
                console.log("decoded", decoded);
                if (error) {
                    return res.status(401).json({
                        code: 401,
                        message:
                            "Token inválido o expirado.",
                    });
                }

                try {
                    let usuario = await Usuario.findByPk(decoded.data.id, {
                        attributes: ["id", "firstName", "lastName", "email", "status"],
                    });
                    if (!usuario) {
                        return res.status(400).json({
                            code: 400,
                            message: "Usuario no existe en el sistema.",
                        });
                    }
                    req.usuario = usuario;
                    next();
                } catch (error) {
                    res.status(500).json({ code: 500, message: "Error de autencicación." })
                }
            }
        );
    } catch (error) {
        return res.status(401).json({
            code: 401,
            message: error.message,
        });
    }
};



