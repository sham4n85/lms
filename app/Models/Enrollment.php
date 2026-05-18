<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Enrollment extends Model
{
    protected $fillable = ['user_id', 'course_id', 'status', 'started_at', 'completed_at', 'score'];

    protected $casts = [
        'started_at'   => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function moduleCompletions(): HasMany
    {
        return $this->hasMany(ModuleCompletion::class);
    }

    public function progressPercent(): int
    {
        $total = $this->course->modules()->count();
        if ($total === 0) return 0;
        $done = $this->moduleCompletions()->count();
        return (int) round(($done / $total) * 100);
    }

    public function isModuleComplete(int $moduleId): bool
    {
        return $this->moduleCompletions()->where('module_id', $moduleId)->exists();
    }
}
