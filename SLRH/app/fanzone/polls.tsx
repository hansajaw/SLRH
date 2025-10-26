// app/fanzone/polls.tsx
import React, { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

/* ---------------- Types & Sample Data ---------------- */
type Poll = {
  id: string;
  question: string;
  options: { id: string; label: string; votes: number }[];
  closesAt?: string; // ISO
};

type Quiz = {
  id: string;
  prompt: string;
  options: { id: string; label: string; correct: boolean }[];
  explanation?: string;
};

const POLLS: Poll[] = [
  {
    id: "p1",
    question: "Who will win the upcoming Colombo Night Sprint?",
    options: [
      { id: "o1", label: "Driver A", votes: 42 },
      { id: "o2", label: "Driver B", votes: 36 },
      { id: "o3", label: "Driver C", votes: 22 },
    ],
    closesAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "p2",
    question: "Best circuit for overtakes?",
    options: [
      { id: "o1", label: "Katukurunda", votes: 58 },
      { id: "o2", label: "Pannala", votes: 31 },
      { id: "o3", label: "Koggala", votes: 11 },
    ],
  },
];

const QUIZZES: Quiz[] = [
  {
    id: "q1",
    prompt: "What flag indicates an immediate race stop?",
    options: [
      { id: "a", label: "Yellow flag", correct: false },
      { id: "b", label: "Red flag", correct: true },
      { id: "c", label: "Black flag", correct: false },
      { id: "d", label: "Blue flag", correct: false },
    ],
    explanation:
      "A red flag signals an immediate halt due to unsafe conditions on track.",
  },
  {
    id: "q2",
    prompt: "What does a blue flag mean?",
    options: [
      { id: "a", label: "Pit lane closed", correct: false },
      { id: "b", label: "Debris on track", correct: false },
      { id: "c", label: "Let faster car pass", correct: true },
      { id: "d", label: "Jump start penalty", correct: false },
    ],
    explanation:
      "Blue flags instruct a slower driver to let a faster, lapping car pass safely.",
  },
];

/* ---------------- Reusable UI Bits ---------------- */
function Chip({
  label,
  active,
  onPress,
  palette,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  palette: any;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? palette.accent + "22" : palette.card,
          borderColor: active ? palette.accent : palette.border,
        },
      ]}
    >
      <Text
        style={[
          styles.chipText,
          { color: active ? palette.accent : palette.text },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/* ---------------- Main Screen ---------------- */
export default function PollsScreen() {
  const { palette } = useTheme();

  // local state: votes and quiz answers
  const [selectedPollOption, setSelectedPollOption] = useState<
    Record<string, string | undefined>
  >({});
  const [submittedPoll, setSubmittedPoll] = useState<Record<string, boolean>>(
    {}
  );

  const [selectedQuizOption, setSelectedQuizOption] = useState<
    Record<string, string | undefined>
  >({});
  const [quizChecked, setQuizChecked] = useState<Record<string, boolean>>({});

  // derived tallies when user submits a vote (local simulation)
  const computedPolls = useMemo(() => {
    return POLLS.map((p) => {
      if (!submittedPoll[p.id]) return p;
      const votedId = selectedPollOption[p.id];
      if (!votedId) return p;

      const total = p.options.reduce((a, b) => a + b.votes, 0) + 1;
      const opts = p.options.map((o) =>
        o.id === votedId ? { ...o, votes: o.votes + 1 } : o
      );
      return { ...p, options: opts, total };
    });
  }, [submittedPoll, selectedPollOption]);

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: palette.background }]}
      edges={["top", "bottom"]}
    >
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* --- Active Polls --- */}
        <SectionTitle label="Active Polls" palette={palette} />

        {computedPolls.map((poll) => {
          const picked = selectedPollOption[poll.id];
          const isDone = !!submittedPoll[poll.id];
          const totalVotes =
            poll.options.reduce((a, b) => a + b.votes, 0) +
            (isDone && picked ? 0 : 0);

          return (
            <View
              key={poll.id}
              style={[
                styles.card,
                { backgroundColor: palette.card, borderColor: palette.border },
              ]}
            >
              <Text style={[styles.cardTitle, { color: palette.text }]}>
                {poll.question}
              </Text>

              <View style={{ height: 8 }} />
              <View style={{ gap: 8 }}>
                {poll.options.map((o) => {
                  const active = picked === o.id;
                  const pct =
                    totalVotes === 0
                      ? 0
                      : Math.round((o.votes / totalVotes) * 100);

                  return (
                    <Pressable
                      key={o.id}
                      disabled={isDone}
                      onPress={() =>
                        setSelectedPollOption((m) => ({ ...m, [poll.id]: o.id }))
                      }
                      style={[
                        styles.pollRow,
                        {
                          borderColor: active ? palette.accent : palette.border,
                          backgroundColor: active
                            ? palette.accent + "1A"
                            : palette.input,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.pollLabel,
                          {
                            color: active ? palette.accent : palette.text,
                          },
                        ]}
                      >
                        {o.label}
                      </Text>
                      {isDone && (
                        <Text
                          style={[
                            styles.pollPct,
                            { color: palette.textSecondary },
                          ]}
                        >
                          {pct}%
                        </Text>
                      )}
                    </Pressable>
                  );
                })}
              </View>

              <View style={{ height: 10 }} />
              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <Ionicons
                    name="time-outline"
                    size={14}
                    color={palette.textSecondary}
                  />
                  <Text style={{ color: palette.textSecondary, marginLeft: 6 }}>
                    {poll.closesAt
                      ? `Closes ${new Date(poll.closesAt).toLocaleString()}`
                      : "Open poll"}
                  </Text>
                </View>

                {!isDone ? (
                  <Pressable
                    onPress={() =>
                      setSubmittedPoll((m) => ({ ...m, [poll.id]: true }))
                    }
                    disabled={!picked}
                    style={[
                      styles.primaryBtn,
                      {
                        backgroundColor: picked
                          ? palette.accent
                          : palette.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.primaryText,
                        { color: picked ? "#001018" : palette.textSecondary },
                      ]}
                    >
                      Vote
                    </Text>
                  </Pressable>
                ) : (
                  <Text style={{ color: palette.textSecondary }}>
                    Vote recorded
                  </Text>
                )}
              </View>
            </View>
          );
        })}

        {/* --- Quizzes --- */}
        <SectionTitle label="Quizzes" palette={palette} />

        {QUIZZES.map((q) => {
          const picked = selectedQuizOption[q.id];
          const checked = !!quizChecked[q.id];
          const isCorrect = checked
            ? q.options.find((o) => o.id === picked)?.correct === true
            : undefined;

          return (
            <View
              key={q.id}
              style={[
                styles.card,
                { backgroundColor: palette.card, borderColor: palette.border },
              ]}
            >
              <Text style={[styles.cardTitle, { color: palette.text }]}>
                {q.prompt}
              </Text>

              <View style={{ height: 8 }} />
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {q.options.map((o) => {
                  const active = picked === o.id;
                  const showState = checked && active;
                  const stateBorder =
                    showState && isCorrect
                      ? "#22C55E"
                      : showState
                      ? "#EF4444"
                      : active
                      ? palette.accent
                      : palette.border;

                  return (
                    <Chip
                      key={o.id}
                      label={o.label}
                      active={active}
                      palette={{ ...palette, border: stateBorder }}
                      onPress={() =>
                        !checked &&
                        setSelectedQuizOption((m) => ({ ...m, [q.id]: o.id }))
                      }
                    />
                  );
                })}
              </View>

              <View style={{ height: 12 }} />
              <View style={styles.row}>
                {!checked ? (
                  <Pressable
                    onPress={() =>
                      setQuizChecked((m) => ({ ...m, [q.id]: true }))
                    }
                    disabled={!picked}
                    style={[
                      styles.primaryBtn,
                      {
                        backgroundColor: picked
                          ? palette.accent
                          : palette.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.primaryText,
                        { color: picked ? "#001018" : palette.textSecondary },
                      ]}
                    >
                      Check
                    </Text>
                  </Pressable>
                ) : (
                  <View style={styles.rowLeft}>
                    <Ionicons
                      name={isCorrect ? "checkmark-circle" : "close-circle"}
                      size={18}
                      color={isCorrect ? "#22C55E" : "#EF4444"}
                    />
                    <Text
                      style={{
                        color: isCorrect ? "#22C55E" : "#EF4444",
                        marginLeft: 6,
                        fontWeight: "800",
                      }}
                    >
                      {isCorrect ? "Correct!" : "Not quite"}
                    </Text>
                  </View>
                )}
              </View>

              {checked && q.explanation && (
                <Text
                  style={{
                    marginTop: 8,
                    color: palette.textSecondary,
                    lineHeight: 20,
                  }}
                >
                  {q.explanation}
                </Text>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- Small Components ---------------- */
function SectionTitle({ label, palette }: { label: string; palette: any }) {
  return (
    <View style={{ marginBottom: 8, marginTop: 6 }}>
      <Text style={{ color: palette.text, fontWeight: "900", fontSize: 16 }}>
        {label}
      </Text>
    </View>
  );
}

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  safe: { paddingTop:-50},
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
  },
  cardTitle: { fontSize: 15, fontWeight: "800" },

  row: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  rowLeft: { flexDirection: "row", alignItems: "center" },

  chip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  chipText: { fontWeight: "800" },

  pollRow: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pollLabel: { fontWeight: "800" },
  pollPct: { fontWeight: "700" },

  primaryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  primaryText: { fontWeight: "900" },
});
