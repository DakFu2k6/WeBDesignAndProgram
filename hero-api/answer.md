### Question 1
1. UNIQUE — team.name đã tồn tại là "Avengers".
2. FOREIGN KEY — hero.team_id = 99 nhưng team có id = 99 không tồn tại.
3. NOT NULL — hero.name được khai báo NOT NULL nhưng INSERT không cung cấp name.
4. FOREIGN KEY — team id = 1 đang được các hero tham chiếu qua hero.team_id.

### Question 2
Quan hệ Team → Hero là one-to-many. Một team có thể có nhiều hero, nhưng mỗi hero chỉ thuộc tối đa một team. Vì vậy foreign key team_id được đặt trong bảng hero để mỗi hero tham chiếu đến team mà nó thuộc về.

### Question 3
Cần ba bảng:
hero:
- id: PK
- các thông tin hero
mission:
- id: PK
- title
heromissionlink:
- hero_id: FK → hero.id
- mission_id: FK → mission.id
- composite primary key (hero_id, mission_id)
Bảng heromissionlink cho phép một hero thuộc nhiều mission và một mission có nhiều hero.

### Question 4
Đọc DATABASE_URL từ environment variable có hai lợi ích chính:
1. Không phải hard-code username/password database vào source code, giúp tránh đưa credentials vào Git hoặc chia sẻ chúng cùng project.
2. Có thể sử dụng cùng một source code với nhiều môi trường khác nhau bằng cách thay đổi DATABASE_URL mà không cần sửa database.py.

### Question 5
id được khai báo là int | None với default=None vì khi tạo một object Hero trong Python, object chưa được database cấp primary key. Giá trị ban đầu là None. Sau khi INSERT và refresh, database sẽ tạo và trả về giá trị id.

### Question 6
Các thuộc tính trở thành column của Hero table là: id, name, age, team_id và secret_name. Thuộc tính team không trở thành column riêng. Nó là SQLModel Relationship dùng để truy cập Team liên quan. back_populates liên kết hai phía của relationship: Team.heroes và Hero.team.