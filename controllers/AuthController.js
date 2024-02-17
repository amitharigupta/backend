import prisma from '../database/db.config.js';
import vine, { errors } from '@vinejs/vine';
import { registerSchema, loginSchema } from '../validations/authValidation.js';
import { encryptPassword, compareHashPassword, generateAuthToken } from "../utils/util.js";
import { generateRandomNum, imageValidator } from "../utils/helper.js";
class AuthController {
    static async register(req, res) {
        try {
            const body = req.body;
            const validator = vine.compile(registerSchema);
            const payload = await validator.validate(body);

            // check if email already exist
            const isEmailExist = await prisma.users.findUnique({ where: { email: payload.email } });

            console.log(isEmailExist);
            if (isEmailExist) {
                return res.status(404).json({ status: 404, message: "Email Already Exist" });
            }
            // Encrypt the password
            payload.password = await encryptPassword(payload.password);
            const user = await prisma.users.create({ data: payload });

            return res.status(201).json({ status: true, message: "User Created Successfully", data: user });
        } catch (error) {
            if (error instanceof errors.E_VALIDATION_ERROR) {
                console.log(error.messages);
                return res.status(400).json({ status: false, message: "Validation Error Please provide Proper Details", errors: error.messages });
            } else {
                return res.status(500).json({ status: 500, message: `Something went wrong. Please try again.` });
            }
        }
    }

    static async login(req, res) {
        try {
            const body = req.body;
            const validator = vine.compile(loginSchema);
            const payload = await validator.validate(body);

            // Find User with email
            const isEmailExist = await prisma.users.findUnique({ where: { email: payload.email }});

            if(!isEmailExist) {
                return res.status(400).json({ status: 400, message: "No User Found" })
            }

            // Password Check
            let isPasswordValid = await compareHashPassword(payload.password, isEmailExist.password);
            if(!isPasswordValid) {
                return res.status(400).json({ status: 400, message: "Invalid Creds UnAuthorized..." });
            }

            // Generate Token
            let token = await generateAuthToken({ id: isEmailExist.id, email: payload.email });
            if(!token) {
                return res.status(400).json({ status: 400, message: "Invalid Token" });
            }

            return res.status(200).json({ status: true, message: "User Logged in successfully", data: isEmailExist, token: `Bearer ${token}` });
        } catch (error) {
            if (error instanceof errors.E_VALIDATION_ERROR) {
                console.log(error.messages);
                return res.status(400).json({ status: false, message: "Validation Error Please provide Proper Details", errors: error.messages });
            } else {
                return res.status(500).json({ status: 500, message: `Something went wrong. Please try again.` });
            }
        }
    }

    static async getUserDetails(req, res) {
        try {
            const user = await prisma.users.findUnique({ where: { email: req.email }});
            return res.status(200).json({ status: 200, message: "User fetched successfully", data: user });
        } catch (error) {
            console.log(`Error while getting getUserDetails ${error}`);
        }
    }

    static async logout(req, res) {
        try {

        } catch (error) {

        }
    }

    static async updateUserProfile(req, res) {
        try {
            const { id } = req.params;
            const authUser = req.user;

            if(!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).json({ status: 400, message: "Profile image is required" });
            }

            const profile = req.files.profile;
            const message = await imageValidator(profile?.size, profile?.mimetype);

            if(message !== null) {
                return res.status(400).json({ status: 400, errors: { profile: message  } });
            }

            const imgExt = profile.name.split(".")[1];
            const imageName = await generateRandomNum() + "." + imgExt;

            const uploadPath = process.cwd() + "/public/images/" + imageName;

            profile.mv(uploadPath, (err) => {
                if(err) throw err;
            });

            await prisma.users.update({
                data: {
                    profile: imageName
                },
                where: {
                    id: Number(id)
                }
            })

            return res.status(200).json({
                status: 200,
                message: "Profile updated successfully",
            })
        } catch (error) {
            console.log(`Something went wrong, ${error}`);
            return res.status(500).json({ status: 500, message: `Something went wrong, ${error}` });
        }
    }
}

export default AuthController;