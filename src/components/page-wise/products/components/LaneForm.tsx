import { Box, MenuItem, Typography } from '@mui/material';
import { Control, Controller, FieldErrors, UseFormWatch } from 'react-hook-form';

import CommonButton from '@/components/common/CommonButton';

import CustomTextField from '@/@core/components/mui/TextField';
import themeConfig from '@/configs/themeConfig';
import { commonSchemas } from '@/schemas/common.schemas';

interface LaneFormProps {
    control: Control<FormData>;
    errors: FieldErrors<FormData>;
    categories: any[];
    laneIndex: number;
    watch: UseFormWatch<FormData>;
    onRemove: () => void;
    loadTagsAgainstCategory: (id: string, index: number) => void;
    onSelectedTagsChange: (index: number, value: string[]) => void;
}

type FormData = (typeof commonSchemas.addProduct)['__outputType'];

export default function LaneForm({
    control,
    errors,
    categories,
    laneIndex,
    watch,
    onRemove,
    loadTagsAgainstCategory,
    onSelectedTagsChange
}: LaneFormProps) {
    const tagOptions = watch(`lanes.${laneIndex}.presentTagOptions`) ?? [];
    const hasTags = tagOptions.length > 0;

    return (
        <Box>
            <Typography variant='subtitle1' mb={2}>{`Lane #${laneIndex + 1}`}</Typography>

            {/* Title */}
            <Controller
                name={`lanes.${laneIndex}.laneTitle`}
                control={control}
                render={({ field }) => (
                    <CustomTextField
                        {...field}
                        label='Lane Title'
                        placeholder='Enter lane title'
                        fullWidth
                        error={!!errors.lanes?.[laneIndex]?.laneTitle}
                        helperText={errors.lanes?.[laneIndex]?.laneTitle?.message}
                        sx={{ mb: 2 }}
                    />
                )}
            />

            {/* Type */}
            <Controller
                name={`lanes.${laneIndex}.type`}
                control={control}
                render={({ field }) => (
                    <CustomTextField
                        {...field}
                        select
                        label='Type'
                        fullWidth
                        sx={{ mb: 2 }}
                        error={!!errors.lanes?.[laneIndex]?.type}
                        helperText={errors.lanes?.[laneIndex]?.type?.message}
                    >
                        <MenuItem value='radio'>Single select (radio)</MenuItem>
                        <MenuItem value='checkbox'>Multi select (checkbox)</MenuItem>
                    </CustomTextField>
                )}
            />

            {/* Category */}
            <Controller
                name={`lanes.${laneIndex}.categoryId`}
                control={control}
                render={({ field }) => (
                    <CustomTextField
                        {...field}
                        select
                        label='Category'
                        placeholder='Select category'
                        onChange={(e) => {
                            field.onChange(e);
                            loadTagsAgainstCategory(e.target.value, laneIndex);
                        }}
                        fullWidth
                        sx={{ mb: 2 }}
                        error={!!errors.lanes?.[laneIndex]?.categoryId}
                        helperText={errors.lanes?.[laneIndex]?.categoryId?.message}
                    >
                        <MenuItem value='-1'>Select</MenuItem>
                        {categories.map((cat) => (
                            <MenuItem key={cat._id} value={cat._id}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </CustomTextField>
                )}
            />

            {/* Tags */}
            <Controller
                name={`lanes.${laneIndex}.selectedTagIds`}
                control={control}
                render={({ field }) => (
                    <CustomTextField
                        {...field}
                        select
                        label='Tags'
                        placeholder='Select tags'
                        disabled={!hasTags}
                        SelectProps={{
                            multiple: true,
                            value: field.value?.length ? field.value : ['-1'],
                            onChange: (e) => {
                                const value = Array.isArray(e.target.value)
                                    ? e.target.value
                                    : (e.target.value as string).split(',');
                                const filtered = value.filter((v) => v !== '-1');
                                onSelectedTagsChange(laneIndex, filtered);
                                field.onChange(filtered);
                            },
                            MenuProps: themeConfig.components.select.MenuProps
                        }}
                        fullWidth
                        sx={{ mb: 2 }}
                        error={!!errors.lanes?.[laneIndex]?.options}
                        helperText={errors.lanes?.[laneIndex]?.options?.message}
                    >
                        <MenuItem value='-1' disabled>
                            Select
                        </MenuItem>
                        {tagOptions.map((tag) => (
                            <MenuItem key={tag.tagId} value={tag.tagId}>
                                {tag.name}
                            </MenuItem>
                        ))}
                    </CustomTextField>
                )}
            />

            {/* Price Inputs */}
            {(watch(`lanes.${laneIndex}.options`) ?? []).map((option: any, optIdx: number) => (
                <Box key={`opt-${laneIndex}-${optIdx}`} display='flex' alignItems='center' gap={2} mb={2}>
                    <CustomTextField value={option.name} label='Tag Name' fullWidth InputProps={{ readOnly: true }} />
                    <Controller
                        name={`lanes.${laneIndex}.options.${optIdx}.price`}
                        control={control}
                        render={({ field }) => (
                            <CustomTextField
                                {...field}
                                type='number'
                                label='Price'
                                fullWidth
                                error={!!errors.lanes?.[laneIndex]?.options?.[optIdx]?.price}
                                helperText={errors.lanes?.[laneIndex]?.options?.[optIdx]?.price?.message}
                            />
                        )}
                    />
                </Box>
            ))}

            <Box textAlign='right' mt={1}>
                <CommonButton
                    label='Remove Lane'
                    type='button'
                    variant='contained'
                    size='small'
                    className='max-w-fit'
                    onClick={onRemove}
                />
            </Box>
        </Box>
    );
}
