# Quiz Question Groups and Find Questions Features

This document describes the implementation of two new features for the Quiz Questions Editor:

## 1. Question Groups

### Overview
Question groups allow organizing quiz questions into logical groups with advanced configuration options.

### Features
- **Group Organization**: Organize questions into named groups with descriptions
- **Random Selection**: Configure groups to randomly select a subset of questions
- **Pagination Control**: Set how many questions from each group appear per page
- **Easy Management**: Move questions between groups with drag-and-drop interface

### Usage
1. Navigate to the "Groups" tab in the Quiz Questions Editor
2. Click "Add Group" to create a new question group
3. Configure group settings:
   - **Name**: Display name for the group
   - **Description**: Optional description explaining the group's purpose
   - **Random Question Selection**: Set to 0 for all questions, or specify a number to randomly pick
   - **Questions Per Page**: Control pagination within the group
4. Move questions to groups using the dropdown in the "Ungrouped Questions" section
5. Remove questions from groups using the "Remove from group" button

### Data Structure
```typescript
interface QuestionGroup {
  id: string;
  name: string;
  description?: string;
  points?: number;
  pickQuestions?: number; // 0 = all, >0 = random selection
  questionsPerPage?: number;
}

interface Question {
  // ... existing fields
  groupId?: string; // Links question to a group
}
```

## 2. Find Questions

### Overview
The Find Questions feature provides a comprehensive search and filtering system for questions, allowing instructors to quickly locate and add questions to their quiz.

### Features
- **Text Search**: Search across question text, titles, and explanations
- **Type Filtering**: Filter by question type (Multiple Choice, True/False, Fill-in-the-blank)
- **Points Filtering**: Filter by point values (1 point, 2-5 points, 6+ points)
- **Source Identification**: Distinguish between current quiz questions and external questions
- **Quick Addition**: Add external questions to the current quiz with one click

### Usage
1. Navigate to the "Find Questions" tab in the Quiz Questions Editor
2. Use the search bar to enter keywords
3. Click "Filters" to access advanced filtering options:
   - Select question type from dropdown
   - Choose point range
   - Clear all filters with one click
4. Browse search results with preview information
5. Click the "+" button to add external questions to your quiz

### Search Functionality
- **Text Matching**: Searches question text, titles, and explanations
- **Case Insensitive**: Search is not case-sensitive
- **Real-time Results**: Results update as you type
- **Result Count**: Shows number of matching questions
- **Clear Options**: Easy filter and search clearing

### Integration
- Questions from external sources can be added to the current quiz
- Current quiz questions are displayed but cannot be re-added
- Added questions become part of the quiz and can be edited normally

## Technical Implementation

### Components
- `QuestionGroupManager.tsx`: Manages question groups and group assignments
- `QuestionFinder.tsx`: Provides search and filtering functionality
- Updated `QuizQuestionsEditor.tsx`: Tabbed interface for all question management

### State Management
- Question groups are stored in the quiz object as `questionGroups` array
- Questions link to groups via `groupId` field
- Search state is managed locally within the QuestionFinder component

### User Experience
- Tabbed interface keeps functionality organized
- Real-time feedback for all operations
- Confirmation dialogs for destructive actions
- Responsive design works on all screen sizes

## Future Enhancements

### Question Groups
- Drag-and-drop reordering within groups
- Group-level point weighting
- Conditional group display based on student performance
- Import/export of question groups

### Find Questions
- Integration with external question banks
- Advanced search with boolean operators
- Question difficulty ratings
- Usage statistics and recommendations
- Bulk question operations

## Usage Examples

### Creating a Group for "Basic Concepts"
1. Go to Groups tab
2. Click "Add Group"
3. Name: "Basic Concepts"
4. Description: "Fundamental concepts all students should know"
5. Random Question Selection: 3 (picks 3 random questions from this group)
6. Questions Per Page: 1
7. Save group
8. Move relevant questions to this group

### Finding Questions About "Arrays"
1. Go to Find Questions tab
2. Search: "array"
3. Filter: Type = "Multiple Choice"
4. Filter: Points = "2-5 points"
5. Review results and add relevant questions to quiz

This implementation provides a robust foundation for advanced quiz question management while maintaining ease of use for instructors.
