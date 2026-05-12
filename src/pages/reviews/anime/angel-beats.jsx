import ReviewLayout from '../../../components/reviews/ReviewLayout'

export default function AngelBeatsReview() {
  return (
    <ReviewLayout
      title="Angel Beats!"
      score={10}
      category="Anime"
      categoryPath="/database/anime"
      cover="/covers/anime/angel-beats.png"
    >
      <p>
        Your full review goes here. Write as much as you want — each paragraph
        is its own p tag inside this ReviewLayout.
      </p>
      <p>
        Add a second paragraph like this.
      </p>
    </ReviewLayout>
  )
}
