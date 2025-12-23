from pydantic import BaseModel
from typing import Dict, List, Any

class StatsSummary(BaseModel):
    period: str
    total_entries: int
    avg_mental_energy: float
    avg_fog_episodes: float
    avg_sleep_hours: float
    habits_completed: Dict[str, int]
    streaks: Dict[str, int]

class CorrelationData(BaseModel):
    sleep_vs_energy: List[Dict[str, float]]
    exercise_vs_fog: List[Dict[str, float]]
    correlations: Dict[str, float]

