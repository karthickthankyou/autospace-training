import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { CompanyInfo } from './CompanyInfo'

export default {
  title: 'components/organisms/CompanyInfo',
  component: CompanyInfo,
} as ComponentMeta<typeof CompanyInfo>

const Template: ComponentStory<typeof CompanyInfo> = (args) => (
  <CompanyInfo {...args} />
)

export const Primary = Template.bind({})
Primary.args = {}
Primary.parameters = {}
