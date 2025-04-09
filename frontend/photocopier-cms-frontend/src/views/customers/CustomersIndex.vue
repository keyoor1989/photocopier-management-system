<template>
  <div class="customers-index">
    <h1>Customers List</h1>
    <p>This is a placeholder for the customers list view.</p>
    <div class="placeholder-content">
      <p>Customer data will be displayed here in a table format.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomersIndex',
  setup() {
    return {};
  }
};
</script>

<style scoped>
.customers-index {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.placeholder-content {
  background-color: #f5f5f5;
  border: 1px dashed #ccc;
  padding: 20px;
  margin-top: 20px;
  border-radius: 4px;
  text-align: center;
}
</style> 