import { Card, Badge } from 'react-bootstrap';

interface QuizAvailabilityCardProps {
  availabilityStatus: string;
  availabilityColourVariant: string;
  availableDate: Date | null;
  untilDate: Date | null;
  dueDate: Date | null;
}

/**
 * Availability Status Card
 * Displays quiz availability information including status badge and date ranges
 */
export default function QuizAvailabilityCard({
  availabilityStatus,
  availabilityColourVariant,
  availableDate,
  untilDate,
  dueDate,
}: QuizAvailabilityCardProps) {
  return (
    <Card className="mb-4">
      <Card.Body>
        <h5 className="card-title">Availability</h5>
        <div className="d-flex align-items-center gap-3">
          <Badge bg={availabilityColourVariant} className="fs-6">
            {availabilityStatus}
          </Badge>
          {availableDate && (
            <span className="text-muted">
              Available from: {availableDate.toLocaleString()}
            </span>
          )}
          {untilDate && (
            <span className="text-muted">
              Until: {untilDate.toLocaleString()}
            </span>
          )}
          {dueDate && (
            <span className="text-muted">Due: {dueDate.toLocaleString()}</span>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
