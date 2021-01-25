import {nametag} from "./signin";

class Profile {
    name: string = ""
    email: string = ""
}

export const GetProfile = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
        return null
    }

    const resp = await fetch(nametag.URL + "/people/me/properties/nt:name,nt:email" +
        "?token=" + encodeURI(token))
    const respBody = await resp.json() as PropertiesResponse

    if (!respBody.properties) {
        return null
    }

    const rv = new Profile()

    const nameProp = respBody.properties.find(p => p.scope === "nt:name")
    if (nameProp) {
        rv.name = nameProp.value as string
    }
    const emailProp = respBody.properties.find(p => p.scope === "nt:email")
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
