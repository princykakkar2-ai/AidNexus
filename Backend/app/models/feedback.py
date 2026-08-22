 from datetime import datetime
from . import db  # Assuming you have a 'db' instance in __init__.py or config

class Feedback(db.Model):
    __tablename__ = 'feedbacks'

    id = db.Column(db.Integer, primary_key=True)
    solution_id = db.Column(db.Integer, db.ForeignKey('solutions.id'), nullable=False)
    expert_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    rating = db.Column(db.Integer, nullable=False)  # 1-5 rating
    feedback_text = db.Column(db.Text, nullable=False)
    suggestions = db.Column(db.Text)
    status = db.Column(db.String(20), nullable=False)  # Approved, Needs Improvement, Rejected

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships (optional)
    solution = db.relationship('Solution', back_populates='feedbacks')
    expert = db.relationship('User', back_populates='feedbacks')
