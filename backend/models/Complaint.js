// backend/models/Complaint.js
class Complaint {
  constructor(id, description, status, createdAt, updatedAt, userId, workerId) {
    this.id = id;
    this.description = description;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.userId = userId;
    this.workerId = workerId;
  }
}

module.exports = Complaint;
