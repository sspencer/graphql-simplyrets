const sideUser = process.env.SIDE_USER
const sideToken = process.env.SIDE_TOKEN

// getUser returns user associated with Bearer token.
// In production code, this would be a DB call.
function getUser(token) {
    if (token === sideToken) {
        return sideUser
    } else {
        return null
    }
}

// Sets a "user" property in the apollo context based on the 
// request's "Authorization" header.  For unmatched Bearer
// token, user is null.
module.exports = ({ req }) => {
    let user = null
    const token = req.headers.authorization || ''
    const parts = token.split(" ")

    // Authorization value must be: "Bearer <token>"
    if (parts.length === 2 && parts[0] === "Bearer") {
        user = getUser(parts[1])
    }

    return { user }
}
