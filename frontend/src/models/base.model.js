export class BaseModel {
  constructor(id, createdAt, updatedAt) {
    this.id = id;
    this.createdAt = createdAt ? new Date(createdAt) : new Date();
    this.updatedAt = updatedAt ? new Date(updatedAt) : new Date();
  }
}
