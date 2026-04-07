# Workshop Card

A rich event display component for presenting scheduled workshops, webinars, meetings, and conferences with attendee information, RSVP options, and status indicators.

## Preview

![Workshop Card Preview](https://hax-design-prod-s3.s3.us-east-2.amazonaws.com/v4_sdk_workshop_card_bcfbb0fc52.png)

## Installation

```shell
hax init
hax add artifact workshop-card
```

## Usage

The workshop card component integrates with AI agents through CopilotKit. Agents automatically create event cards with appropriate status indicators, attendee avatars, and action buttons.

## Component Setup

```tsx
import { HAXWorkshopCard, useWorkshopCardAction } from "@/hax/artifacts/workshop-card";

export function EventsPage() {
  const [artifacts, setArtifacts] = useState([]);

  useWorkshopCardAction({
    addOrUpdateArtifact: (type, data) => {
      setArtifacts(prev => [...prev, { type, data, id: Date.now() }]);
    }
  });

  return (
    <HAXWorkshopCard
      title="AI Development Workshop"
      description="Learn the fundamentals of AI development"
      eventType="Workshop"
      status="confirmed"
      date="Tuesday, January 15, 2025"
      time="10:00 AM - 11:30 AM PST"
      location="Zoom Meeting"
      attendees={[
        { id: "1", name: "Alice", avatarUrl: "/avatars/alice.png" },
        { id: "2", name: "Bob", avatarUrl: "/avatars/bob.png" }
      ]}
      attendeeCount={25}
    />
  );
}
```
