from sqlmodel import Session, select
from app.database import engine
from app.models import (Hero, Mission, Team,)
from sqlmodel import SQLModel

def seed_database():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        existing_team = session.exec(
            select(Team)
        ).first()
        if existing_team is not None:
            print("Database already seeded.")
            return
        avengers = Team(name="Avengers", headquarters="New York",)
        xmen = Team(name="X-Men", headquarters="Westchester",)
        battle_of_sokovia = Mission(title="Battle of Sokovia")
        mutant_rescue = Mission(title="Mutant Rescue")
        heroes = [
            Hero(name="Tony", age=45, secret_name="Iron Man", team=avengers, missions=[battle_of_sokovia],),
            Hero(name="Natasha", age=35, secret_name="Black Widow", team=avengers, missions=[battle_of_sokovia],),
            Hero(name="Steve", age=100, secret_name="Captain America", team=avengers, missions=[battle_of_sokovia],),
            Hero(name="Logan", age=150, secret_name="Wolverine", team=xmen, missions=[mutant_rescue],),
            Hero(name="Jean", age=30, secret_name="Jean Grey", team=xmen, missions=[mutant_rescue],),
        ]
        session.add(avengers)
        session.add(xmen)
        session.add(battle_of_sokovia)
        session.add(mutant_rescue)
        for hero in heroes:
            session.add(hero)
        session.commit()
        print("Database seeded successfully.")

if __name__ == "__main__":
    seed_database()