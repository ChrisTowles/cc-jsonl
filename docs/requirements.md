# Functional Requirements Document

## 1. System Overview

A system that monitors and saves Claude Code chat logs, displaying and operating them through a web interface. It consists of two independent services.

## 2. System Architecture

### 2.1 Service Components

1. **Chat Log Monitoring Service** - File monitoring and database storage
2. **Web Application Service** - Data display and Claude Code SDK integration

### 2.2 Basic Requirements

- **Service Separation**: Monitoring service and web application service can be started independently
- **UI Design**: Mobile-first design

## 3. Functional Requirements

### 3.1 Chat Log Monitoring Service

#### 3.1.1 File Monitoring Function

- **Target File Pattern**: `${target}/${projectName}/${sessionId}.jsonl`
- **Monitoring Target**: Claude Code chat log files (JSON Lines format)
- **Monitoring Method**: Real-time file monitoring
- **Processing Content**: Detection of new file creation and updates

#### 3.1.2 Data Storage Function

- **Stored Data**: Project information, session information, chat logs
- **Data Structure**:
    - Project
    - Session
    - Message
- **Message Format Support**: Ability to save messages in unparseable formats
- **Tool Support**: Ability to parse unknown Tools without errors

### 3.2 Web Application Service

#### 3.2.1 Project Management Function

- **Project List Display**: List of monitored projects
- **Project Selection**: Selection and display of specific projects
- **Project Information Display**: Basic information such as project name, session count, etc.

#### 3.2.2 Session Management Function

- **Session List Display**: List of sessions within selected project
- **Session Selection**: Selection and display of specific sessions
- **Session Information Display**: Session ID, message count, last update time, etc.

#### 3.2.3 Chat Room Function

- **Chat History Display**: Message history of selected session
- **Real-time Display**: Integrated display of saved data and new messages
- **Message Format**: Distinguishable display of user and assistant messages
- **Timestamp Display**: Display of message send time

#### 3.2.4 Claude Code SDK Integration Function

##### 3.2.4.1 Existing Session Integration

- **Session-Specific Sending**: Message sending to specific session ID
- **Context Preservation**: Conversation continuation maintaining existing session context

##### 3.2.4.2 New Session Creation

- **Directory Specification**: New session creation with specified execution directory
- **No Session ID Specified**: Starting new session without session ID

#### 3.2.5 Real-time Communication Function

- **Streaming Processing**: Processing streaming responses from Claude Code SDK
- **Data Integration**: Seamless integration display of saved data and real-time responses
- **State Management**: Proper management of sending, receiving, and completion states

#### 3.2.6 User Interface Function

- **Mobile-First**: Responsive design for smartphones and tablets
- **Navigation**: Hierarchical navigation: Project → Session → Chat Room
- **Real-time Updates**: Automatic display updates for new messages

## 4. Data Flow

### 4.1 Monitoring Service

1. File system monitoring
2. Change detection
3. File content analysis
4. Database storage

### 4.2 Web Application

1. Data retrieval from database
2. UI display
3. User operations (message sending)
4. Message sending via Claude Code SDK
5. Real-time response reception and display