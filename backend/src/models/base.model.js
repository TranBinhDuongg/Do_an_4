// Base Entity Class
class BaseModel {
  constructor(id, createdAt = new Date(), updatedAt = new Date()) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toJSON() {
    return { ...this };
  }
}

module.exports = BaseModel;
