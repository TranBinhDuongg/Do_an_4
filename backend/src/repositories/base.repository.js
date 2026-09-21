// [LỚP 3: DATA ACCESS LAYER]
// Base Repository Pattern - Cung cấp các thao tác CRUD cơ sở
class BaseRepository {
  constructor(initialData = []) {
    // In-memory data store demo (có thể dễ dàng thay bằng Mongoose/Prisma/Sequelize)
    this.collection = new Map();
    initialData.forEach(item => this.collection.set(item.id.toString(), item));
  }

  async findAll() {
    return Array.from(this.collection.values());
  }

  async findById(id) {
    return this.collection.get(id.toString()) || null;
  }

  async create(entity) {
    this.collection.set(entity.id.toString(), entity);
    return entity;
  }

  async update(id, updateData) {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated = { ...existing, ...updateData, updatedAt: new Date() };
    this.collection.set(id.toString(), updated);
    return updated;
  }

  async delete(id) {
    const existing = await this.findById(id);
    if (!existing) return false;
    return this.collection.delete(id.toString());
  }
}

module.exports = BaseRepository;
