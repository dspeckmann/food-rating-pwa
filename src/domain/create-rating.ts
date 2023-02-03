import Taste from "./taste"
import Wellbeing from "./wellbeing"

export default interface CreateRating {
    foodId: string
    petId: string
    taste?: Taste
    wellbeing?: Wellbeing
    comment?: string
    pictureId?: string
}
