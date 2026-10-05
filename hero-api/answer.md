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

### Question 7
So với bảng viết thủ công:
- id vẫn là primary key và được database tạo giá trị.
- name vẫn NOT NULL, nhưng SQLModel có thêm index vì dùng Field(index=True).
- age cho phép NULL vì được khai báo int | None.
- team_id cho phép NULL và có foreign key tham chiếu team.id.
- SQLModel/SQLAlchemy có thể tạo thêm index và constraint metadata tương ứng với các Field được khai báo trong model.

### Question 8
Không, CREATE TABLE cho hero/team không được thực hiện lại nếu các bảng đã tồn tại.
SQLModel.metadata.create_all() chỉ tạo những bảng chưa tồn tại. Nó không drop và tạo lại các bảng hiện có.

### Question 9
Dòng `from app import models` import các model Team và Hero trước khi SQLModel.metadata.create_all(engine) chạy. Nhờ đó các table được đăng ký trong SQLModel metadata.

### Question 10
session.add() đưa object vào SQLAlchemy/SQLModel session, nhưng không tự commit transaction. 
session.commit() mới thực sự commit transaction và lưu INSERT vào database.
session.refresh() đọc lại object từ database sau khi commit, nhờ đó các giá trị do database tạo, chẳng hạn id, được cập nhật vào Python object.
Nếu comment session.commit() trong create_hero thì INSERT không được commit xuống database, vì vậy row sẽ không được persist sau transaction.

### Question 11
PATCH với {"age": 17} tạo dữ liệu update chỉ chứa field age nhờ exclude_unset=True. SQLAlchemy/SQLModel vì vậy tạo UPDATE chỉ thay đổi field age thay vì ghi đè toàn bộ các column khác. Điều này xảy ra vì PATCH chỉ nên thay đổi những field mà client thực sự gửi.

### Question 12
Không, secret_name không xuất hiện trong JSON response. Dòng chịu trách nhiệm là: response_model=HeroPublic HeroPublic chỉ chứa các field public và không chứa secret_name.

### Question 13
Khi gọi GET /heroes?min_age=18&team_id=1, các giá trị 18 và 1 được truyền vào query dưới dạng bound parameters của SQLAlchemy. Chúng không được nối trực tiếp vào SQL string. Vì vậy dữ liệu người dùng không được thực thi như một phần của SQL command, giúp chống SQL injection.

### Question 14
Nên filter trong database vì database có thể thực hiện WHERE trực tiếp và chỉ trả về những row cần thiết. Nếu lấy toàn bộ Hero về Python rồi mới filter, ứng dụng phải truyền và lưu trữ nhiều dữ liệu không cần thiết, làm tăng memory usage và network traffic và kém hiệu quả khi database lớn.

### Question 15
create_all() chỉ tạo các table được khai báo trong SQLModel metadata nhưng chưa tồn tại trong database. Ở Part 4, hero và team đã tồn tại nên create_all() không tạo lại chúng. Ở Part 7, mission và heromissionlink là các table mới nên create_all() tạo chúng.

### Question 16
Các Team/Mission được INSERT trước để database tạo primary key cho chúng. Sau đó Hero được INSERT. Khi Hero được khai báo: team=avengers SQLAlchemy biết Hero thuộc Team object avengers. Sau khi avengers được persist và có id, SQLAlchemy sử dụng id đó làm hero.team_id. Vì vậy seed script không cần tự viết team_id.

### Question 17
Không có power column. create_all() chỉ tạo table nếu table chưa tồn tại và không thực hiện schema migration cho table hiện có. GET /heroes có thể lỗi vì model Python mong đợi column power nhưng database hero table chưa có column đó. Drop toàn bộ table không phải giải pháp production vì sẽ làm mất dữ liệu hiện có. Production cần migration để thay đổi schema mà bảo toàn dữ liệu.

### Question 18
upgrade() thêm column power vào bảng hero. Đây là bước migration từ schema cũ sang schema mới.  downgrade() xóa column power khỏi bảng hero. Đây là bước rollback migration về schema trước đó. Phần code cụ thể cần copy đúng từ file migration được Alembic tạo ra.

### Question 19
Alembic lưu revision hiện tại của database trong table alembic_version. Thư mục migrations/ phải được commit vào Git vì nó chứa các migration scripts cần thiết để những người khác có thể xây dựng/cập nhật database đúng theo cùng một schema.

### Question 20
Alembic có thể generate một migration coi việc đổi tên field là drop column secret_name và add column alias thay vì nhận ra đây là rename column. Điều này nguy hiểm vì drop secret_name có thể làm mất dữ liệu đang tồn tại trong column đó. Migration cần được review và sửa thủ công để thực hiện ALTER COLUMN RENAME, ví dụ:
op.alter_column(
    "hero",
    "secret_name",
    new_column_name="alias",
)
Sau đó migration thử nghiệm không được apply theo yêu cầu của bài, và model phải được đổi lại secret_name.