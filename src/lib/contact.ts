export type ContactValues = {
  name: string
  businessName: string
  email: string
  phone: string
  currentWebsite: string
  businessType: string
  mainGoal: string
  budget: string
  projectDescription: string
  company: string
  startedAt: number
}

export type ContactErrors = Partial<Record<keyof ContactValues, string>>

export const emptyContactValues: ContactValues = {
  name: '',
  businessName: '',
  email: '',
  phone: '',
  currentWebsite: '',
  businessType: '',
  mainGoal: '',
  budget: '',
  projectDescription: '',
  company: '',
  startedAt: 0,
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {}
  if (!values.name.trim()) errors.name = 'Please enter your name.'
  if (!values.businessName.trim()) errors.businessName = 'Please enter your business name.'
  if (!emailPattern.test(values.email.trim())) errors.email = 'Please enter a valid email address.'
  if (!values.businessType) errors.businessType = 'Choose the type of business.'
  if (!values.mainGoal) errors.mainGoal = 'Choose the main goal for the website.'
  if (!values.budget) errors.budget = 'Choose a comfortable budget range.'
  if (values.projectDescription.trim().length < 20) {
    errors.projectDescription = 'Tell us a little more about the project (at least 20 characters).'
  }
  if (values.currentWebsite.trim()) {
    try {
      new URL(values.currentWebsite)
    } catch {
      errors.currentWebsite = 'Enter a complete website address, including https://.'
    }
  }
  return errors
}

export function cleanContactValues(values: ContactValues): ContactValues {
  return {
    ...values,
    name: values.name.trim(),
    businessName: values.businessName.trim(),
    email: values.email.trim().toLowerCase(),
    phone: values.phone.trim(),
    currentWebsite: values.currentWebsite.trim(),
    projectDescription: values.projectDescription.trim(),
    company: values.company.trim(),
  }
}
