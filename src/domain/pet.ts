import Picture from "./picture"

export default interface Pet {
    id: string
    name: string
    picture?: Picture
    createdAt: string
    updatedAt: string
}
