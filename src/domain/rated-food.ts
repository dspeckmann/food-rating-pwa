import Rating from "./rating"

export default interface RatedFood {
    picture: Blob
    rating: Rating
    date: Date
}
