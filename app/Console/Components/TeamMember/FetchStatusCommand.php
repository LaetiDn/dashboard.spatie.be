<?php

namespace App\Console\Components\TeamMember;

use App\Events\TeamMember\UpdateStatus;
use App\Services\Slack\Member;
use App\Services\Slack\Slack;
use Illuminate\Console\Command;

class FetchStatusCommand extends Command
{
    protected $signature = 'dashboard:fetch-team-member-status';

    protected $description = 'Determine team member statuses';

    protected $slackMembers = [
        'seb',
        'adriaan',
        'freek',
        'willem',
        'alex',
        'ruben',
        'rias',
        'brent',
        'jef',
        'wouter',
    ];

    public function handle(Slack $slack)
    {
        $this->info('Fetching team member statuses from Slack...');

        $slack
            ->getMembers($this->slackMembers)
            ->each(function (Member $member) {
                event(new UpdateStatus(strtolower($member->name), $member->statusEmoji));
            });

        $this->info('All done!');
    }
}
