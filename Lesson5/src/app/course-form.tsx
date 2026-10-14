import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { api } from "../services/api";

export default function CourseFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Lấy ID để biết là đang Thêm hay Sửa
  const isEditing = !!id;

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Khởi tạo các State lưu trữ dữ liệu form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [instructor, setInstructor] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    // 1. Tải danh mục từ API đổ vào Dropdown (Picker)
    api.getCategories().then((res) => {
      setCategories(res.data);
      if (res.data.length > 0 && !isEditing) {
        setCategoryId(res.data[0].id); // Mặc định chọn danh mục đầu tiên
      }
    });

    // 2. Nếu đang ở chế độ Sửa, gọi API lấy dữ liệu cũ điền vào form
    if (isEditing) {
      api.getCourseById(id as string).then((res) => {
        const course = res.data;
        setTitle(course.title);
        setDescription(course.description);
        setCategoryId(course.categoryId);
        setInstructor(course.instructor);
        setPrice(course.price.toString());
        setDuration(course.duration.toString());
        setThumbnail(course.thumbnail);
        setTrailerUrl(course.trailerUrl);
      });
    }
  }, [id]);

  const handleSave = async () => {
    // Kiểm tra các trường bắt buộc
    if (!title.trim() || !instructor.trim() || !price.trim() || !categoryId) {
      const msg =
        "Vui lòng nhập đầy đủ Tên khóa học, Giảng viên, Học phí và Danh mục!";
      Platform.OS === "web" ? window.alert(msg) : Alert.alert("Lỗi", msg);
      return;
    }

    // Học phí và thời lượng không được âm
    if (Number(price) < 0 || Number(duration) < 0) {
      const msg = "Học phí và Thời lượng không được âm!";
      Platform.OS === "web" ? window.alert(msg) : Alert.alert("Lỗi", msg);
      return;
    }

    const courseData = {
      title,
      description,
      categoryId,
      instructor,
      price: Number(price),
      duration: Number(duration),
      thumbnail,
      trailerUrl,
    };

    try {
      setLoading(true);
      if (isEditing) {
        await api.updateCourse(id as string, courseData); // Gọi API Sửa
      } else {
        await api.addCourse(courseData); // Gọi API Thêm
      }
      router.back(); // Lưu xong quay lại trang trước
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      const msg = "Có lỗi xảy ra khi lưu khóa học.";
      Platform.OS === "web" ? window.alert(msg) : Alert.alert("Lỗi", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>{"< Quay lại"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? "Sửa Khóa Học" : "Thêm Khóa Học Mới"}
        </Text>
      </View>

      <Text style={styles.label}>Tên khóa học (*)</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Vd: Lập trình React Native"
      />

      <Text style={styles.label}>Danh mục (*)</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={categoryId}
          onValueChange={(itemValue) => setCategoryId(itemValue)}
        >
          {categories.map((cat) => (
            <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Giảng viên (*)</Text>
      <TextInput
        style={styles.input}
        value={instructor}
        onChangeText={setInstructor}
        placeholder="Vd: Nguyễn Văn A"
      />

      <Text style={styles.label}>Học phí (VNĐ) (*)</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        placeholder="Vd: 500000"
      />

      <Text style={styles.label}>Thời lượng (Giờ)</Text>
      <TextInput
        style={styles.input}
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
        placeholder="Vd: 30"
      />

      <Text style={styles.label}>Mô tả chi tiết</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Mô tả khóa học..."
        multiline
        numberOfLines={3}
      />

      <Text style={styles.label}>Link Ảnh Bìa (Thumbnail)</Text>
      <TextInput
        style={styles.input}
        value={thumbnail}
        onChangeText={setThumbnail}
        placeholder="https://domain.com/anh.jpg"
      />

      <Text style={styles.label}>Link Trailer Video (MP4)</Text>
      <TextInput
        style={styles.input}
        value={trailerUrl}
        onChangeText={setTrailerUrl}
        placeholder="https://domain.com/video.mp4"
      />

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveBtnText}>
          {loading ? "Đang lưu..." : "LƯU KHÓA HỌC"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  backBtn: {
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginRight: 16,
  },
  backBtnText: { color: "#333", fontWeight: "bold" },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
  label: { fontSize: 14, fontWeight: "bold", marginBottom: 6, color: "#555" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  textArea: { height: 100, textAlignVertical: "top" },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fafafa",
  },
  saveBtn: {
    backgroundColor: "#2185D0",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
