import { PostItem } from "@/components/post-list/PostList"

export type PostItemProps = {
    id: number
    name: string
    appealPoint: string
    imageUrl: string
    price: number
    likes: number
}
  
  

const dummyProducts: PostItemProps[] = [
    { id: 1, name: "高級腕時計", appealPoint: "職人技が光る逸品。精巧な機械式ムーブメントを搭載し、洗練されたデザインが特徴です。", imageUrl: "/placeholder.svg?height=200&width=300", price: 250000, likes: 15 },
    { id: 2, name: "スマートフォン", appealPoint: "最新テクノロジー搭載。高性能カメラと長時間バッテリーで、あなたの生活をサポートします。", imageUrl: "/placeholder.svg?height=200&width=300", price: 120000, likes: 42 },
    { id: 3, name: "デザイナーバッグ", appealPoint: "上質な素材使用。職人の技が光る、長く愛用できる逸品です。", imageUrl: "/placeholder.svg?height=200&width=300", price: 180000, likes: 28 },
    { id: 4, name: "ハイエンドノートPC", appealPoint: "パワフルな性能と洗練されたデザイン。クリエイティブワークにも最適です。", imageUrl: "/placeholder.svg?height=200&width=300", price: 220000, likes: 36 },
    { id: 5, name: "高級イヤホン", appealPoint: "臨場感ある音質で音楽体験を一新。ノイズキャンセリング機能搭載で没入感抜群です。", imageUrl: "/placeholder.svg?height=200&width=300", price: 45000, likes: 19 },
    { id: 6, name: "電動自転車", appealPoint: "長距離走行可能。環境に優しく、快適な乗り心地を実現しました。", imageUrl: "/placeholder.svg?height=200&width=300", price: 150000, likes: 23 },
]
  
export default function Page() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
            みんなの投稿一覧
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {dummyProducts.map((product) => (
              <PostItem key={product.id} {...product} />
            ))}
          </div>
        </div>
      </div>
    )
  }