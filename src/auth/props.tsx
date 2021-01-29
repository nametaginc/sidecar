import {auth} from "./signin";

class Profile {
    name: string = ""
    email: string = ""
}

export const GetProfile = async (): Promise<Profile|null> => {

    const props = await auth.GetProperties(["nt:name", "nt:email"])
    if (!props) {
        return null
    }

    const rv = new Profile()
    const nameProp = props.get("nt:name")
    if (nameProp) {
        rv.name = nameProp.value as string
    }

    const emailProp = props.get("nt:email")
    if (emailProp) {
        rv.email = emailProp.value as string
    }

    return rv
}
