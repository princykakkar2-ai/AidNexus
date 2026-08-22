# from flask import Blueprint, request, jsonify
# from flask_jwt_extended import jwt_required, get_jwt_identity
# from app.models.feedback import Feedback
# from app.models.solution import Solution
# from app.models.user import User
# from app import db

# feedback_bp = Blueprint('feedback', __name__, url_prefix='/api/feedback')

# # Get all solutions assigned to expert or available for review
# @feedback_bp.route('/expert/solutions', methods=['GET'])
# @jwt_required()
# def get_expert_solutions():
#     expert_id = get_jwt_identity()
#     # For simplicity, return all solutions requiring review; 
#     # can add filtering logic as needed
#     solutions = Solution.query.all()
#     result = []
#     for sol in solutions:
#         # Include minimal info for dashboard
#         result.append({
#             'id': sol.id,
#             'project_title': sol.project_title,
#             'student_name': sol.student_name,
#             'problem_description': sol.problem_description[:150] + '...' if sol.problem_description else '',
#             'status': sol.status,
#             'technologies': sol.technologies,
#         })
#     return jsonify(result), 200

# # Get details of a particular solution
# @feedback_bp.route('/solution/<int:solution_id>', methods=['GET'])
# @jwt_required()
# def get_solution(solution_id):
#     sol = Solution.query.get_or_404(solution_id)
#     data = {
#         'id': sol.id,
#         'project_title': sol.project_title,
#         'problem_statement': sol.problem_description,
#         'student_name': sol.student_name,
#         'student_email': sol.student_email,
#         'solution_description': sol.solution_description,
#         'technologies': sol.technologies,
#         'github_link': sol.github_link,
#         'demo_link': sol.demo_link,
#         'status': sol.status
#     }
#     return jsonify(data), 200

# # Get feedback for a particular solution
# @feedback_bp.route('/solution/<int:solution_id>/feedback', methods=['GET'])
# @jwt_required()
# def get_feedback(solution_id):
#     feedbacks = Feedback.query.filter_by(solution_id=solution_id).all()
#     data = []
#     for fb in feedbacks:
#         data.append({
#             'id': fb.id,
#             'expert_id': fb.expert_id,
#             'rating': fb.rating,
#             'feedback_text': fb.feedback_text,
#             'suggestions': fb.suggestions,
#             'status': fb.status,
#             'created_at': fb.created_at.isoformat()
#         })
#     return jsonify(data), 200

# # Submit feedback
# @feedback_bp.route('/solution/<int:solution_id>', methods=['POST'])
# @jwt_required()
# def submit_feedback(solution_id):
#     expert_id = get_jwt_identity()
#     json_data = request.get_json()
#     rating = json_data.get('rating')
#     feedback_text = json_data.get('feedback')
#     suggestions = json_data.get('suggestions')
#     status = json_data.get('status')

#     if not rating or not feedback_text or not status:
#         return jsonify({'message': 'Rating, feedback, and status are required'}), 400

#     sol = Solution.query.get_or_404(solution_id)

#     # Create new feedback record
#     new_feedback = Feedback(
#         solution_id=solution_id,
#         expert_id=expert_id,
#         rating=rating,
#         feedback_text=feedback_text,
#         suggestions=suggestions,
#         status=status
#     )
#     db.session.add(new_feedback)
#     # Update solution status
#     sol.status = status
#     db.session.commit()
#     return jsonify({'message': 'Feedback submitted successfully'}), 201
