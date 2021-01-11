import {nametagURL} from "./signin";

class Profile {
    name: string = ""
    email: string = ""
}

export const GetProfile = async () => {
    const tokenStr = localStorage.getItem("token")
    if (!tokenStr) {
        return null
    }
    const token = JSON.parse(atob(tokenStr.split(".")[1])) as IDToken

    const resp = await fetch(nametagURL + "/people/me/properties/nt:name,nt:email" +
        "?token=" + encodeURI(tokenStr))
    const respBody = await resp.json() as PropertiesResponse

    const rv = new Profile()

    const nameProp = respBody.properties.find(p => p.scope == "nt:name")
    if (nameProp) {
        rv.name = nameProp.value as string
    }
    const emailProp = respBody.properties.find(p => p.scope == "nt:email")
    if (emailProp) {
        rv.name = emailProp.value as string
    }
    return rv
}

interface PropertiesResponse {
    sub: string
    properties: PropertyData[]
}

interface PropertyData {
    scope: string
    value: any
    exp: number
}
interface IDToken {
    aud: string
    exp: number
    iat: number
    iss: string
    nbf: number
    sub: string
}

