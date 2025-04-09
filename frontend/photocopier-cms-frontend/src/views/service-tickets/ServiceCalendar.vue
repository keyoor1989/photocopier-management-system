<template>
  <div class="service-calendar">
    <div class="calendar-header">
      <h2>Service Calendar</h2>
      <div class="calendar-controls">
        <button @click="previousMonth" class="control-btn">
          <i class="fas fa-chevron-left"></i>
        </button>
        <span class="current-month">{{ currentMonth }}</span>
        <button @click="nextMonth" class="control-btn">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <i class="fas fa-spinner fa-spin"></i>
      <span>Loading calendar...</span>
    </div>

    <div v-else-if="error" class="error-state">
      <i class="fas fa-exclamation-circle"></i>
      <span>{{ error }}</span>
      <button @click="fetchCalendarData" class="retry-btn">
        Retry
      </button>
    </div>

    <div v-else class="calendar-grid">
      <div class="calendar-weekdays">
        <div v-for="day in weekdays" :key="day" class="weekday">
          {{ day }}
        </div>
      </div>
      <div class="calendar-days">
        <div
          v-for="day in calendarDays"
          :key="day.date"
          class="calendar-day"
          :class="{
            'current-month': day.isCurrentMonth,
            'today': day.isToday,
            'has-tickets': day.tickets.length > 0
          }"
          @click="openDayDetails(day)"
        >
          <div class="day-number">{{ day.date.getDate() }}</div>
          <div v-if="day.tickets.length > 0" class="ticket-indicator">
            {{ day.tickets.length }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedDay" class="day-details-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ formatDate(selectedDay.date) }}</h3>
          <button @click="closeDayDetails" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="tickets-list">
          <div
            v-for="ticket in selectedDay.tickets"
            :key="ticket.id"
            class="ticket-item"
            @click="openTicketDetails(ticket)"
          >
            <div class="ticket-time">{{ formatTime(ticket.time) }}</div>
            <div class="ticket-info">
              <div class="ticket-title">{{ ticket.title }}</div>
              <div class="ticket-customer">{{ ticket.customer }}</div>
            </div>
            <div class="ticket-status" :class="ticket.status">
              {{ ticket.status }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns'
import { useServiceTicketsStore } from '@/stores/serviceTickets'

const router = useRouter()
const serviceTicketsStore = useServiceTicketsStore()

const currentDate = ref(new Date())
const loading = ref(false)
const error = ref(null)
const selectedDay = ref(null)
const calendarData = ref([])

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const currentMonth = computed(() => {
  return format(currentDate.value, 'MMMM yyyy')
})

const calendarDays = computed(() => {
  const start = startOfMonth(currentDate.value)
  const end = endOfMonth(currentDate.value)
  const days = eachDayOfInterval({ start, end })
  
  return days.map(date => ({
    date,
    isCurrentMonth: isSameMonth(date, currentDate.value),
    isToday: isToday(date),
    tickets: calendarData.value.filter(ticket => 
      isSameMonth(new Date(ticket.date), date) &&
      new Date(ticket.date).getDate() === date.getDate()
    )
  }))
})

const previousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  )
  fetchCalendarData()
}

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  )
  fetchCalendarData()
}

const formatDate = (date) => {
  return format(date, 'MMMM d, yyyy')
}

const formatTime = (time) => {
  return format(new Date(time), 'h:mm a')
}

const openDayDetails = (day) => {
  if (day.tickets.length > 0) {
    selectedDay.value = day
  }
}

const closeDayDetails = () => {
  selectedDay.value = null
}

const openTicketDetails = (ticket) => {
  router.push(`/service-tickets/${ticket.id}`)
}

const fetchCalendarData = async () => {
  loading.value = true
  error.value = null

  try {
    const data = await serviceTicketsStore.fetchCalendarData({
      month: currentDate.value.getMonth() + 1,
      year: currentDate.value.getFullYear()
    })
    calendarData.value = data
  } catch (err) {
    error.value = 'Failed to load calendar data'
    console.error('Error fetching calendar data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCalendarData()
})
</script>

<style scoped>
.service-calendar {
  padding: 2rem;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.calendar-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.calendar-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.control-btn {
  padding: 0.5rem;
  background-color: #f3f4f6;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.control-btn:hover {
  background-color: #e5e7eb;
}

.current-month {
  font-size: 1.125rem;
  font-weight: 500;
  color: #374151;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
}

.loading-state i {
  font-size: 2rem;
  color: #6366f1;
}

.error-state {
  background-color: #fee2e2;
  border-radius: 8px;
  color: #ef4444;
}

.error-state i {
  font-size: 2rem;
}

.retry-btn {
  padding: 0.5rem 1rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-btn:hover {
  background-color: #dc2626;
}

.calendar-grid {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 1rem;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.weekday {
  text-align: center;
  font-weight: 500;
  color: #6b7280;
  padding: 0.5rem;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.calendar-day {
  aspect-ratio: 1;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.calendar-day:hover {
  background-color: #f3f4f6;
}

.calendar-day.current-month {
  background-color: white;
}

.calendar-day:not(.current-month) {
  background-color: #f9fafb;
  color: #9ca3af;
}

.calendar-day.today {
  border-color: #6366f1;
}

.calendar-day.has-tickets {
  background-color: #eef2ff;
}

.day-number {
  font-size: 0.875rem;
  font-weight: 500;
}

.ticket-indicator {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background-color: #6366f1;
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
}

.day-details-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.close-btn {
  padding: 0.5rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #6b7280;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #1f2937;
}

.tickets-list {
  padding: 1rem;
}

.ticket-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  transition: background-color 0.2s;
}

.ticket-item:last-child {
  border-bottom: none;
}

.ticket-item:hover {
  background-color: #f3f4f6;
}

.ticket-time {
  font-size: 0.875rem;
  color: #6b7280;
  min-width: 80px;
}

.ticket-info {
  flex: 1;
}

.ticket-title {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.ticket-customer {
  font-size: 0.875rem;
  color: #6b7280;
}

.ticket-status {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  text-transform: capitalize;
}

.ticket-status.open {
  background-color: #fee2e2;
  color: #ef4444;
}

.ticket-status.in-progress {
  background-color: #fef3c7;
  color: #f59e0b;
}

.ticket-status.completed {
  background-color: #dcfce7;
  color: #10b981;
}

@media (max-width: 768px) {
  .service-calendar {
    padding: 1rem;
  }

  .calendar-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .calendar-day {
    padding: 0.25rem;
  }

  .day-number {
    font-size: 0.75rem;
  }

  .ticket-indicator {
    font-size: 0.625rem;
    padding: 0.125rem 0.25rem;
  }
}
</style> 