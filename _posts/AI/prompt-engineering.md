---
title: Mình bị ép phải học prompt engineering
date: 2026-06-17
excerpt: Thất nghiệp quá chán. AI chiếm hết jobs rồi. Giờ mình học cách làm việc chung với AI để kiếm việc. Và mình bắt đầu với Prompt Engineering
category: LEARNING
---
## Prompt Engineering là gì

Nhìn chung từ khi AI xuất hiện, ai ai cũng dành thời gian nói chuyện với AI. AI có khôn có gà, nhưng nhìn rộng ra, có thể output AI tệ không phải là tại nó, mà tại bạn đưa ra câu chuyện có phần chưa đầy đủ để nó trả lời đúng ý. Mình nghĩ đó là lý do ra đời của Prompt Engineering. Không chỉ là kể chuyện gì, cách kể còn ảnh hưởng đến output.

## Prompt Engineering là làm gì

### Token

Trước tiên phải hiểu token trong các LLM là gì. Đơn giản là các ký tự khi được đọc và tạo ra bởi AI là token. Khi mà nhập câu lệnh (hay gọi là prompt), LLM phân tách các văn bản thành mảnh nhỏ, chuyển đổi thành số và đưa vào mạng nơ-ron để tính toán. Và mỗi mô hình đều có giới hạn lượng token tối đa cho mỗi lần trò chuyện, gọi là Context Window. Nhìn chung khi sử dụng chat thông thường, hay API, agent, chi phí và tốc độ được tính dựa trên tổng số lượng token đầu vào và đầu ra.

### Prompt ngắn đi chưa chắc đã tối ưu token

Prompt A:

```text
Generate comprehensive unit tests for this function that cover all edge cases and all error conditions, and ensure good code coverage with meaningful test names and proper assertions.
```

Prompt B:

```text
Generate unit tests for this function.
Categories: [happy path, boundary, invalid input, exception]
Format: pytest, one test per case, name pattern: test_<category>_<scenario>
```

Đọc prompt A cảm giác ngắn hơn và sẽ giống người hơn, nhưng nó lại hoạt động tệ hơn prompt B. Vấn đề không phải là độ dài prompt hay giống người, mà là **mỗi token trong prompt đó làm được gì**.

Phân tích chút về prompt A: "comprehensive", "all edge cases", "meaningful" đối với AI là mù mờ, không rõ nghĩa. Model vẫn phải tự quyết định: bao nhiêu test case là "comprehensive", "meaningful" là đặt tên kiểu gì, "all edge cases" là có những cases nào.

Prompt B dài hơn chút, nhưng đầy đủ và rõ nghĩa về số lượng cases, dùng format nào, đặt tên như nào. Đây là 1 kiểu trade-off: đầu tư nhiêu input token để thu hẹp sự lựa chọn của model.

### AI sẽ hiểu con số hơn câu chữ

```text
Keep the implementation concise.
```

Vừa rồi là một kiểu prompt hồi mới tiếp cận AI mình hay dùng. Có vẻ ngắn và súc tích (từ concise cũng nghĩa là súc tích). Nhưng chưa chắc 10 người đọc câu này đã hiểu và làm giống như prompt này, chứ chưa chắc là AI đọc. Model không có ground truth để dựa vào, nó sẽ tự chọn một định nghĩa "concise" mà nó đã học, và cũng chẳng biết nó hiểu concise giống mình không.

Việc sử dụng con số và quy luật cụ thể có thể khắc phục điều này. Kiểu như này:

```text
Max 20 lines per function. No helper functions unless reused 2+ times.
```

### Quan tâm đến Context Window

Khi mà prompt AI, mình sẽ cố nhét system prompt, mô tả nhiệm vụ cần làm và các file codebase cần biết để hoàn thành task đó. Khi mà context window sắp đạt ngưỡng, điều đầu tiên mình nghĩ đến là hạn chế codebase context và task description, giữ nguyên system prompt vì nó mô tả dự án, có các yêu cầu, convention mà AI phải làm.

Thực tế làm thế dễ gây ảo giác cho AI. Vì system prompt nói cho AI biết "cách làm", codebase context nói "cái gì đang có". Model cần biết cái gì đang có để khó mà bịa ra output. Ví dụ: Bạn yêu cầu AI tạo function gọi vào UserService, system prompt có thể nói "dùng FastAPI, async/await, dependency injection,...". Nhưng nếu thiếu UserService interface trong context, model sẽ tự bịa method name, return types hay pattern xử lý lỗi.

Đây là thứ tự ưu tiên khi context window bị giới hạn:

1. Task description: nói cho model biết nó phải làm gì
2. Relevant codebase context: nói cho model biết environment, function, interface thật
3. System prompt: nói cho model biết convention, coding style

System prompt có thể rút gọn, inline vào task. Nhưng codebase context sai, thiếu sẽ khiến codebase không chạy được.

### Ràng buộc việc có thể làm

Khi prompt một cách bình thường để thêm code dựa trên requirement gì đó, model có thể tự sáng tạo thêm logic không có vì nó nghĩ là cần, thêm error hay helper function. Thêm `Follow requirements document. Do not add extra logic` là chưa đủ, AI vẫn sẽ thêm linh tinh cả vì nó nghĩ rằng nó đang giúp mình.

Thêm ràng buộc kiểu này sẽ hiệu quả hơn:

```text
<spec>
[requirements document here]
</spec>

Rules:
- Only implement what is explicitly stated in <spec>
- If a behavior is not mentioned in <spec>, do NOT add it
- If requirements are ambiguous, output a comment: # UNCLEAR: <question> instead of assuming
```

Dòng cuối là quan trọng nhất. Không chỉ cản AI tự bịa hay ảo giác giúp đỡ, mà còn nói rõ nên làm gì khi thực sự không biết. Khi mà thực sự không biết, nó sẽ trả lời theo mẫu chứ không nói vòng vo, tự đoán hoặc tự bịa fact nữa. Pattern này gọi là **graceful degradation**, thay vì fail silently bằng generate code sai, model xuống cấp có kiểm soát, có comment rõ ràng và xử lý phần khác.

### Prompt dài và chi tiết quá chưa chắc đã là ý hay

Khi mà prompt dài, gồm system context, codebase, requirements, constraint, task detail,... một vấn đề sẽ xuất hiện: AI nhớ đầu cuối, nhưng lại quên đoạn giữa. Research (nguồn trust me bro) gọi đây là **lost in the middle**, attention của model yếu nhất ở phần giữa context, mạnh ở phần đầu và phần cuổi. Nếu để các constraint quan trọng ở cuối prompt, model có thể apply được, nhưng nếu ở giữa task description và codebase dài, model sẽ miss đoạn constraint đó.

Giờ một prompt mình dùng có structure như này:

1. Assign Role: cho AI biết góc nhìn
2. Critical Constraint: cho AI biết rules được làm và không được làm
3. Task description + goal: cho AI biết phải làm gì, mục tiêu là gì
4. Detail/Codebase context/Spec: cho AI biết thêm các thông tin đi kèm
5. Remind key constraint: cho AI nhớ lại các rules quan trọng

Detail ở giữa vì model có thể không cần nhớ toàn bộ, chỉ cần tra cứu khi generate từng phần. Constraints ở đầu và lặp lại ở cuối vì model cần apply chúng xuyên suốt.

## Áp dụng

Với một function như này:

```python
def divide(a: float, b: float) -> float:
    return a / b
```

Thì đây là cách mình prompt để sinh unitests:

```text
You are a Senior Python developer.

Rules:
- Only generate tests for the function provided
- Do not add helpers, fixtures, or imports beyond pytest
- If a case is ambiguous, add: # UNCLEAR: <question> and skip

Task: Generate unit tests for this function:
def divide(a: float, b: float) -> float:
    return a / b

Categories: [happy path, boundary, invalid input, exception]
Format: pytest, one test per case
Naming: test_<category>_divide

Rules (remind):
- Stick to categories above, do not add extra cases
```

Ngoài ra, khi call API thường có tham số temperature trong khoảng $\lbrack 0;1 \rbrack$, quyết định độ sáng tạo của output. Với những task kiểu này, đặt temperature là 0 vì không cần creativity.

## Bài học

1. Prompt tốt không phải là prompt ngắn, mà là prompt mà mỗi token loại bỏ được một chỗ model phải tự đoán.
2. Đừng dùng tính từ để mô tả output. "Concise", "clean", "comprehensive" không có nghĩa gì với model nếu không có số hay rule đi kèm. Model không biết bạn muốn gì, nó chỉ đoán theo những gì nó đã học.
3. Khi context window bị giới hạn, cắt system prompt trước, giữ lại codebase context. System prompt nói cách làm, codebase context nói cái gì đang tồn tại. Thiếu cái sau thì model bịa.
4. Không chỉ cấm model làm sai, phải nói cho nó biết phải làm gì khi không chắc. Graceful degradation: flag lại bằng comment, không tự đoán, không tự bịa.
5. Constraints đặt ở đầu prompt và nhắc lại ở cuối. Đoạn giữa là nơi model hay quên nhất.
