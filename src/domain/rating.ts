import Food from './food'
import Pet from './pet'
import Picture from './picture'
import Taste from "./taste"
import Wellbeing from "./wellbeing"

export default interface Rating {
    id: string
    pet: Pet
    food: Food
    taste?: Taste
    wellbeing?: Wellbeing
    comment: string
    picture?: Picture
    createdAt: string
}
