import Food from './food'
import Pet from './pet'
import Taste from "./taste"
import Wellbeing from "./wellbeing"

export default interface Rating {
    pet: Pet
    food: Food
    taste?: Taste
    wellbeing?: Wellbeing
    comment: string
    pictureDataString?: string
    createdAt: string
}
