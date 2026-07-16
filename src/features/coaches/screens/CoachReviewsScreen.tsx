import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Star, ChatCircle } from "phosphor-react-native";
import {
  Text,
  Card,
  Divider,
  Skeleton,
  StatePlaceholder,
  colors,
  spacing,
} from "@/ui";
import { Screen } from "@/ui";
import type { MemberScreenProps } from "@/app/navigation/types";
import { formatDate } from "@/lib/format";

interface Review {
  id: string;
  name: string;
  rating: number;
  dateIso: string;
  text: string;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: "r1",
    name: "Ravi",
    rating: 5,
    dateIso: "2026-06-28T10:00:00Z",
    text: "Clear plan, held me to it. Real progress in six weeks.",
  },
  {
    id: "r2",
    name: "Meera",
    rating: 5,
    dateIso: "2026-06-14T10:00:00Z",
    text: "Patient with a returning knee injury. Adjusted every session.",
  },
  {
    id: "r3",
    name: "Arjun",
    rating: 4,
    dateIso: "2026-05-30T10:00:00Z",
    text: "Knows his programming. Punctual and direct without being harsh.",
  },
  {
    id: "r4",
    name: "Sana",
    rating: 5,
    dateIso: "2026-05-12T10:00:00Z",
    text: "Formed good habits around food and sleep, not just the lifting.",
  },
];

export function CoachReviewsScreen({ navigation, route }: MemberScreenProps<"CoachReviews">) {
  const { coachId } = route.params;
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const t = setTimeout(() => {
      setReviews(MOCK_REVIEWS);
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, [coachId]);

  if (loading) {
    return (
      <Screen>
        <Text preset="title" style={styles.title}>
          Reviews
        </Text>
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} height={92} radius={16} style={styles.skeleton} />
        ))}
      </Screen>
    );
  }

  if (reviews.length === 0) {
    return (
      <Screen>
        <StatePlaceholder
          variant="empty"
          icon={<ChatCircle size={40} color={colors.text.secondary} />}
          title="No reviews yet"
          body="This coach has not been reviewed. Be the first after your session."
          actionLabel="Go back"
          onAction={() => navigation.goBack()}
        />
      </Screen>
    );
  }

  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <Screen scroll>
      <View style={styles.head}>
        <Text preset="title">Reviews</Text>
        <View style={styles.avg}>
          <Star size={16} weight="fill" color={colors.text.secondary} />
          <Text preset="bodyMedium" color="secondary" style={{ marginLeft: 4 }}>
            {average.toFixed(1)} · {reviews.length} reviews
          </Text>
        </View>
      </View>

      <Card padded>
        {reviews.map((r, i) => (
          <View key={r.id}>
            {i > 0 ? <Divider style={styles.divider} /> : null}
            <ReviewItem review={r} />
          </View>
        ))}
      </Card>
    </Screen>
  );
}

function ReviewItem({ review }: { review: Review }) {
  return (
    <View>
      <View style={styles.rowHead}>
        <Text preset="bodyMedium">{review.name}</Text>
        <Text preset="body" color="secondary">
          {formatDate(review.dateIso)}
        </Text>
      </View>
      <StarRow rating={review.rating} />
      <Text preset="body" color="secondary" style={styles.text}>
        {review.text}
      </Text>
    </View>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <View style={styles.stars}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          size={13}
          weight={i < rating ? "fill" : "regular"}
          color={i < rating ? colors.text.secondary : colors.text.disabled}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { marginBottom: spacing.lg },
  skeleton: { marginBottom: spacing.md },
  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  avg: { flexDirection: "row", alignItems: "center" },
  divider: { marginVertical: spacing.lg },
  rowHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stars: { flexDirection: "row", gap: 2, marginTop: 6 },
  text: { marginTop: spacing.sm },
});
