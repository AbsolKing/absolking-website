import ReviewLayout from '../../../components/reviews/ReviewLayout'

export default function SlayTheSpire2Review() {
  return (
    <ReviewLayout
      title="Slay the Spire II"
      score={10}
      category="Games"
      categoryPath="/database/games"
      cover="/covers/games/slay-the-spire-2.jpg"
    >
      <p>
        Your full review goes here.
      </p>
      <p>
        Add more paragraphs as needed.
      </p>
    </ReviewLayout>
  )
}
