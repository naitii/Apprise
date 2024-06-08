import jwt from 'jsonwebtoken';
// import cookieParser from 'cookie-parser';

const generateTokensAndSetCookies = (userId, res) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "20d",
    })

    res.cookie("token", token, {
        httpOnly: true, 
        maxAge: 20 * 24 * 60 * 60 * 1000, 
        sameSite: "strict",
    });
    return token;
}

export default generateTokensAndSetCookies;