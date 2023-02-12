import Picture from './picture'

export default interface Food {
    id: string
    name: string
    picture?: Picture
    createdAt: string
    updatedAt: string
    isRatedWell?: boolean
    lastRatingDate?: string
}
