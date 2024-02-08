import { COMPANIES_LIST_QUERY } from "@/graphql/queries";
import { CreateButton, DeleteButton, EditButton, FilterDropdown, List, useTable } from "@refinedev/antd";
import { HttpError, getDefaultFilter, useGo } from "@refinedev/core";
import { Input, Space, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { CustomAvatar } from "@/components/custom-avatar";
import { Text } from "@/components/text";
import { Company } from "@/graphql/schema.types";
import { currencyNumber } from "@/utils/currency-numaber";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { CompaniesListQuery } from "@/graphql/types";

export const CompanyList = ({children}: React.PropsWithChildren) => {
	const go = useGo()
	const { tableProps, filters } = useTable<
		GetFieldsFromList<CompaniesListQuery>,
		HttpError,
		GetFieldsFromList<CompaniesListQuery>
		>({
		resource: 'companies',
		onSearch: (values) => {
			return [
				{
					field: 'name',
					operator: 'contains',
					value: values.name
				}
			]
		},
		meta: {
			gqlQuery: COMPANIES_LIST_QUERY
		},
		pagination: {
			pageSize: 12
		},
		sorters: {
			initial: [
				{
					field: 'createdAt',
					order: 'desc'
				}
			]
		},
		filters:{
			initial: [
				{
					field: 'name',
					operator: 'contains',
					value: undefined
				}
			]
		}
	})

	return (
		<div>
			<List
				breadcrumb={false}
				headerButtons={() => (
					<CreateButton
						onClick={() => {
							go({
								to: {
									resource: 'companies',
									action: 'create'
								},
								options: {
									keepQuery: true
								},
								type: 'replace'
							})
						}} 
					/>
				)}
			>
				<Table
					{...tableProps}
					pagination={
						{...tableProps.pagination}
					}
				>
					<Table.Column<Company>
						dataIndex='name'
						title='Company Title'
						defaultFilteredValue={getDefaultFilter('id', filters)} 
						filterIcon={<SearchOutlined />}
						filterDropdown={props => (
							<FilterDropdown
								{...props} 
							>
								<Input placeholder="Search Company"/>
							</FilterDropdown>
						)}
						render={(value, record) => {
							return (
								<Space>
									<CustomAvatar
										name={record.name}
										shape="square"
										src={record.avatarUrl} 
									/>

									<Text
										style={{
											whiteSpace: 'nowrap'
										}}
									>
										{record.name}
									</Text>
								</Space>
							)
						}}
					/>

					<Table.Column<Company>
						dataIndex='totalRevenue'
						title='Open Deals Amount'
						render={(value, record) => (
							<Text>
								{currencyNumber(record?.dealsAggregate?.[0].sum?.value || 0)}
							</Text>
						)}
					/>

					<Table.Column<Company>
						dataIndex='id'
						title='Actions'
						fixed='right'
						render={(value) => (
							<Space>
								<EditButton 
									hideText
									size="small"
									recordItemId={value}
								/>
								<DeleteButton 
									hideText
									size="small"
									recordItemId={value}
								/>
							</Space>
						)}
					/>
						
				</Table>
			</List>
			{children}
		</div>	
	)
};
