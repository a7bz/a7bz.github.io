---
icon: c#
date: 2025-12-30
category:
  - 代码
tag:
  - c#
  - .net
---

# C# 12 新特性深度解析

## 背景

C# 12 是 .NET 8 生态系统的一部分，于 2023 年 11 月发布，带来了许多实用的新特性，旨在提高开发效率、简化代码并增强类型安全性。本文将深入解析 C# 12 的主要新特性，并通过实际示例展示如何在项目中使用这些特性。

## 1. 主构造函数 (Primary Constructors)

### 1.1 传统构造函数的问题

在 C# 12 之前，创建一个包含多个属性的类通常需要编写大量重复代码：

```csharp
// 传统方式
public class Person
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public int Age { get; set; }
    
    public Person(string firstName, string lastName, int age)
    {
        FirstName = firstName;
        LastName = lastName;
        Age = age;
    }
}
```

### 1.2 主构造函数的实现

C# 12 引入了主构造函数，允许在类定义时直接声明构造函数参数：

```csharp
// C# 12 主构造函数
public class Person(string firstName, string lastName, int age)
{
    public string FirstName { get; set; } = firstName;
    public string LastName { get; set; } = lastName;
    public int Age { get; set; } = age;
}
```

### 1.3 主构造函数与字段

主构造函数参数可以直接用于初始化字段：

```csharp
public class Person(string firstName, string lastName, int age)
{
    private readonly string _fullName = $"{firstName} {lastName}";
    
    public string FullName => _fullName;
    public int Age { get; set; } = age;
}
```

### 1.4 主构造函数与继承

主构造函数可以与继承一起使用：

```csharp
public class Student(string firstName, string lastName, int age, string studentId) : Person(firstName, lastName, age)
{
    public string StudentId { get; set; } = studentId;
}
```

## 2. 集合表达式 (Collection Expressions)

### 2.1 传统集合初始化

传统的集合初始化需要指定集合类型：

```csharp
// 传统方式
var list = new List<int> { 1, 2, 3, 4, 5 };
var array = new int[] { 1, 2, 3, 4, 5 };
var dictionary = new Dictionary<string, int> { { "one", 1 }, { "two", 2 } };
```

### 2.2 集合表达式语法

C# 12 引入了统一的集合表达式语法，使用 `[]` 来创建各种集合类型：

```csharp
// C# 12 集合表达式
List<int> list = [1, 2, 3, 4, 5];
int[] array = [1, 2, 3, 4, 5];
Dictionary<string, int> dictionary = [ ["one", 1], ["two", 2] ];
```

### 2.3 扩展集合表达式

集合表达式可以与 `..` 运算符一起使用，用于合并现有集合：

```csharp
var existingList = new List<int> { 1, 2, 3 };
var newList = [0, ..existingList, 4, 5]; // 结果: [0, 1, 2, 3, 4, 5]

var array1 = new int[] { 1, 2 };
var array2 = new int[] { 3, 4 };
var combinedArray = [..array1, ..array2]; // 结果: [1, 2, 3, 4]
```

### 2.4 集合表达式与接口

集合表达式可以用于任何实现了 `ICollection<T>` 或 `IEnumerable<T>` 的类型：

```csharp
// 自定义集合类型
public class MyCollection<T> : List<T>
{
    // 自定义实现
}

// 使用集合表达式初始化
MyCollection<int> myCollection = [1, 2, 3, 4, 5];
```

## 3. 内联数组 (Inline Arrays)

### 3.1 传统数组的性能问题

传统数组在某些场景下可能存在性能开销，因为它们需要在堆上分配内存。

### 3.2 内联数组的定义

C# 12 引入了内联数组，允许将数组元素直接嵌入到结构体中：

```csharp
[System.Runtime.CompilerServices.InlineArray(8)]
public struct Buffer
{
    private int _element0;
}
```

### 3.3 内联数组的使用

内联数组可以像普通数组一样使用：

```csharp
var buffer = new Buffer();
for (int i = 0; i < 8; i++)
{
    buffer[i] = i * 2;
}

for (int i = 0; i < 8; i++)
{
    Console.WriteLine(buffer[i]); // 输出: 0, 2, 4, 6, 8, 10, 12, 14
}
```

### 3.4 内联数组的性能优势

内联数组将元素直接存储在结构体中，避免了堆分配，从而提高了性能，特别适合高性能场景：

```csharp
// 性能测试示例
var stopwatch = new System.Diagnostics.Stopwatch();

// 测试传统数组
stopwatch.Start();
for (int i = 0; i < 1000000; i++)
{
    var array = new int[8];
    for (int j = 0; j < 8; j++)
    {
        array[j] = j;
    }
}
stopwatch.Stop();
Console.WriteLine($"传统数组: {stopwatch.ElapsedMilliseconds}ms");

// 测试内联数组
stopwatch.Restart();
for (int i = 0; i < 1000000; i++)
{
    var buffer = new Buffer();
    for (int j = 0; j < 8; j++)
    {
        buffer[j] = j;
    }
}
stopwatch.Stop();
Console.WriteLine($"内联数组: {stopwatch.ElapsedMilliseconds}ms");
```

## 4. 类型别名 (Type Aliases)

### 4.1 传统类型别名的限制

在 C# 12 之前，只能使用 `using` 指令创建类型别名，而且只能在单个文件中使用：

```csharp
// 传统方式 - 仅在当前文件有效
using StringList = System.Collections.Generic.List<string>;
```

### 4.2 全局类型别名

C# 12 允许在任何类型声明中使用 `using` 指令创建全局类型别名：

```csharp
// 在项目的任何文件中定义
global using StringList = System.Collections.Generic.List<string>;

// 在项目的任何文件中使用
StringList names = ["Alice", "Bob", "Charlie"];
```

### 4.3 泛型类型别名

可以为泛型类型创建别名：

```csharp
global using Result<T> = System.Threading.Tasks.Task<System.Nullable<T>>;

// 使用
Result<int> GetNumberAsync() => Task.FromResult<int?>(42);
```

## 5. 特性的目标类型推断

### 5.1 传统特性使用

在 C# 12 之前，使用特性时需要显式指定类型：

```csharp
[return: CustomAttribute]
public string GetName() => "test";

[field: CustomAttribute]
private string _name;
```

### 5.2 特性的目标类型推断

C# 12 允许编译器推断特性的目标类型：

```csharp
// C# 12 - 编译器推断目标类型
[CustomAttribute]
public string GetName() => "test";

[CustomAttribute]
private string _name;
```

## 6. Lambda 表达式的类型推断增强

### 6.1 传统 Lambda 表达式

在 C# 12 之前，Lambda 表达式需要显式指定参数类型，或者上下文能够推断出类型：

```csharp
// 传统方式
Func<int, int> square = x => x * x;
Action<string> print = s => Console.WriteLine(s);
```

### 6.2 Lambda 表达式的类型推断增强

C# 12 增强了 Lambda 表达式的类型推断，允许更灵活的使用：

```csharp
// C# 12 - Lambda 表达式的类型推断增强
var square = (int x) => x * x;
var print = (string s) => Console.WriteLine(s);

// 甚至可以省略参数类型
var add = (x, y) => x + y; // 推断为 Func<int, int, int>
```

## 7. 异步流的增强

### 7.1 传统异步流

```csharp
async IAsyncEnumerable<int> GenerateNumbersAsync(int count)
{
    for (int i = 0; i < count; i++)
    {
        await Task.Delay(100);
        yield return i;
    }
}
```

### 7.2 异步流的增强

C# 12 增强了异步流的支持，允许在更多场景下使用：

```csharp
// 使用集合表达式创建异步流
async IAsyncEnumerable<int> GetNumbersAsync()
{
    await Task.Delay(100);
    yield return 1;
    yield return 2;
    yield return 3;
}

// 消费异步流
await foreach (var number in GetNumbersAsync())
{
    Console.WriteLine(number);
}
```

## 8. 实际应用示例

### 8.1 使用主构造函数和集合表达式创建 API 模型

```csharp
// 定义 API 模型
public class Product(string name, decimal price, params string[] categories)
{
    public string Name { get; set; } = name;
    public decimal Price { get; set; } = price;
    public IReadOnlyList<string> Categories { get; set; } = [..categories];
    public DateTime CreatedAt { get; } = DateTime.UtcNow;
}

// 使用
var product = new Product("Laptop", 999.99m, "Electronics", "Computers");
Console.WriteLine($"Product: {product.Name}, Price: {product.Price}");
Console.WriteLine($"Categories: {string.Join(", ", product.Categories)}");
```

### 8.2 使用内联数组优化高性能计算

```csharp
[System.Runtime.CompilerServices.InlineArray(16)]
public struct MatrixRow
{
    private double _element0;
}

[System.Runtime.CompilerServices.InlineArray(16)]
public struct Matrix
{
    private MatrixRow _row0;
}

// 矩阵乘法
Matrix Multiply(Matrix a, Matrix b)
{
    Matrix result = new();
    
    for (int i = 0; i < 16; i++)
    {
        for (int j = 0; j < 16; j++)
        {
            double sum = 0;
            for (int k = 0; k < 16; k++)
            {
                sum += a[i][k] * b[k][j];
            }
            result[i][j] = sum;
        }
    }
    
    return result;
}
```

### 8.3 使用全局类型别名简化代码

```csharp
// 在项目中定义全局类型别名
global using AppDbContext = MyApp.Data.ApplicationDbContext;
global using ServiceResult<T> = MyApp.Common.Result<T>;
global using ErrorCode = MyApp.Common.ErrorCodes;

// 在控制器中使用
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    
    public ProductsController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    
    [HttpGet]
    public async Task<ActionResult<ServiceResult<List<Product>>>> GetProducts()
    {
        var products = await _dbContext.Products.ToListAsync();
        return Ok(new ServiceResult<List<Product>>(products));
    }
}
```

## 9. 迁移到 C# 12 的最佳实践

### 9.1 逐步迁移

1. 首先更新项目的目标框架到 .NET 8
2. 然后将语言版本设置为 C# 12
3. 逐步应用新特性，从最安全的开始

### 9.2 优先使用的特性

- **集合表达式**：简单易用，风险低，能立即简化代码
- **全局类型别名**：可以减少重复代码，提高代码一致性
- **主构造函数**：适用于新创建的类，能减少样板代码

### 9.3 谨慎使用的特性

- **内联数组**：只在确实需要性能优化时使用，需要进行充分的测试
- **Lambda 表达式的类型推断增强**：确保代码的可读性，避免过度使用

## 10. 总结

C# 12 带来了许多实用的新特性，这些特性旨在提高开发效率、简化代码并增强类型安全性。主要包括：

1. **主构造函数**：减少样板代码，简化类的定义
2. **集合表达式**：统一的集合初始化语法，支持扩展集合
3. **内联数组**：提高性能，特别适合高性能场景
4. **全局类型别名**：减少重复代码，提高代码一致性
5. **特性的目标类型推断**：简化特性的使用
6. **Lambda 表达式的类型推断增强**：更灵活的 Lambda 表达式使用
7. **异步流的增强**：更好的异步流支持

这些新特性使得 C# 12 成为一个更现代化、更高效的编程语言，能够更好地满足现代软件开发的需求。通过合理地使用这些新特性，开发者可以编写更简洁、更高效、更易于维护的代码。

## 11. 参考资料

- [C# 12 官方文档](https://learn.microsoft.com/zh-cn/dotnet/csharp/whats-new/csharp-12)
- [.NET 8 官方文档](https://learn.microsoft.com/zh-cn/dotnet/core/whats-new/dotnet-8)

C# 12 是 C# 语言发展的重要一步，它继续保持了 C# 作为一门现代化、高效、安全的编程语言的地位。随着 .NET 生态系统的不断发展，C# 语言也在不断进化，为开发者提供更好的开发体验和更高的性能。