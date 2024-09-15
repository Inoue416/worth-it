export type SubmitPostDto = {
    email: string,
    title: string,
    appealPoint: string,
    price: number,
    link: string,
    category: string,
    // DBに合わせている
    image_url: string
}

export type GetPostDto = {
    id: number,
    title: string,
    appealPoint: string,
    price: number,
    link: string,
    category: string,
    image: string,
    updated_at: Date
}